export interface FilterData {
  fc: number;
  gain: number;
  q: number;
}

export interface ParseResult {
  data: Record<string, number>;
  filterCount: number;
  processingTime: number;
}

import chalk from "chalk";

export class ParseError extends Error {
  constructor(
    message: string,
    public readonly lineNumber?: number,
  ) {
    super(chalk.red(message));
    this.name = "ParseError";
  }
}

const FILTER_REGEX =
  /Fc\s+([\d.]+)\s+Hz\s+Gain\s+([-\d.]+)\s+dB\s+Q\s+([\d.]+)/i;
const REQUIRED_FILTER_COUNT = 10;
const PRECISION_MULTIPLIER = 100000000000000;

const STATIC_VALUES: Record<string, number> = {
  "30": 3,
  "31": 4,
  "32": 4,
  "33": 4,
  "34": 4,
  "35": 4,
  "36": 4,
  "37": 4,
  "38": 4,
  "39": 2,
  "40": 1,
  "41": 1,
  "42": 1,
  "43": 1,
  "44": 1,
  "45": 1,
  "46": 1,
  "47": 1,
  "48": 1,
  "49": 1,
  "1024": 0,
};

function validateFilter(filterData: FilterData, lineNumber: number): void {
  if (Number.isNaN(filterData.fc) || filterData.fc <= 0) {
    throw new ParseError(
      `Invalid frequency value: ${filterData.fc} Hz`,
      lineNumber,
    );
  }

  if (
    Number.isNaN(filterData.gain) ||
    filterData.gain < -100 ||
    filterData.gain > 100
  ) {
    throw new ParseError(
      `Invalid gain value: ${filterData.gain} dB`,
      lineNumber,
    );
  }

  if (Number.isNaN(filterData.q) || filterData.q <= 0 || filterData.q > 100) {
    throw new ParseError(`Invalid Q factor: ${filterData.q}`, lineNumber);
  }
}

function parseLine(line: string, lineNumber: number): FilterData | null {
  const trimmedLine = line.trim();
  if (!trimmedLine || !trimmedLine.toLowerCase().includes("filter")) {
    return null;
  }

  const match = trimmedLine.match(FILTER_REGEX);
  if (!match) {
    throw new ParseError(
      `Invalid filter format. Expected: "Filter <id>: <state> <type> Fc <freq> Hz Gain <gain> dB Q <q>"`,
      lineNumber,
    );
  }

  const [, fcStr, gainStr, qStr] = match;

  if (fcStr === undefined || gainStr === undefined || qStr === undefined) {
    throw new ParseError(
      `Invalid filter format. Expected: "Filter <id>: <state> <type> Fc <freq> Hz Gain <gain> dB Q <q>"`,
      lineNumber,
    );
  }

  const fc = parseFloat(fcStr);
  const gain = parseFloat(gainStr);
  const q = parseFloat(qStr);

  const filterData: FilterData = { fc, gain, q };
  validateFilter(filterData, lineNumber);

  return filterData;
}

export function parseFilters(input: string): ParseResult {
  const startTime = Date.now();

  if (!input || typeof input !== "string") {
    throw new ParseError("Input must be a non-empty string");
  }

  const lines = input.split("\n");
  const filters: FilterData[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i] ?? "";
    try {
      const filterData = parseLine(currentLine, i + 1);
      if (filterData) {
        filters.push(filterData);
      }
    } catch (error) {
      if (error instanceof ParseError) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new ParseError(
        `Unexpected error at line ${i + 1}: ${errorMessage}`,
      );
    }
  }

  if (filters.length !== REQUIRED_FILTER_COUNT) {
    throw new ParseError(
      `Expected ${REQUIRED_FILTER_COUNT} filters, but found ${filters.length}. ` +
        "Please check the selected equalizer app is 'EqualizerAPO ParametricEq'.",
    );
  }

  const parsedData: Record<string, number> = {};
  const count = filters.length;

  for (const [index, filterData] of filters.entries()) {
    parsedData[`${index}`] = Math.fround(filterData.gain);
    parsedData[`${index + count}`] = Math.round(filterData.fc);
    parsedData[`${index + count * 2}`] =
      Math.round(Math.fround(filterData.q) * PRECISION_MULTIPLIER) /
      PRECISION_MULTIPLIER;
  }

  const endTime = Date.now();
  const processingTime = endTime - startTime;

  return {
    data: {
      ...parsedData,
      ...STATIC_VALUES,
    },
    filterCount: filters.length,
    processingTime,
  };
}

// Legacy function for backward compatibility
export function parseFiltersLegacy(input: string): Record<string, number> {
  const result = parseFilters(input);
  return result.data;
}
