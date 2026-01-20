#!/usr/bin/env bun

import * as path from "node:path";
import chalk from "chalk";
import {
  readFileOptimized,
  validateFileAccess,
  writeFileOptimized,
} from "./lib/fileUtils";
import { parseFilters } from "./lib/parseFilters";

const VERSION = "1.0.0";
const DESCRIPTION =
  "Parse EqualizerAPO parametric EQ filter data and convert to JSON";

function showHelp(): void {
  console.info(`
${chalk.bold.blue(DESCRIPTION)}

${chalk.yellow("Usage:")}
  apo2cdsp <input-file> [options]
  apo2cdsp -h | --help
  apo2cdsp -v | --version

${chalk.yellow("Options:")}
  -h, --help     Show this help message
  -v, --version  Show version information
  -o, --output   Specify output file path (default: same directory as input without any extension, cdsp format)
  --validate     Only validate input file without creating output
  --quiet        Suppress success messages

${chalk.yellow("Examples:")}
  apo2cdsp filters.txt
  apo2cdsp filters.txt -o output.json
  apo2cdsp filters.txt --validate
  apo2cdsp filters.txt --quiet
`);
}

function showVersion(): void {
  console.info(chalk.green(`apo2cdsp v${VERSION}`));
}

interface CliOptions {
  output?: string;
  validate: boolean;
  quiet: boolean;
}

function parseArguments(): { inputFile: string; options: CliOptions } | null {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return null;
  }

  if (args[0] === "-h" || args[0] === "--help") {
    showHelp();
    process.exit(0);
  }

  if (args[0] === "-v" || args[0] === "--version") {
    showVersion();
    process.exit(0);
  }

  const options: CliOptions = {
    validate: false,
    quiet: false,
  };

  let inputFile: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-o":
      case "--output":
        if (i + 1 >= args.length) {
          console.error(chalk.red("Error: --output requires a file path"));
          process.exit(1);
        }
        options.output = args[++i];
        break;
      case "--validate":
        options.validate = true;
        break;
      case "--quiet":
        options.quiet = true;
        break;
      default:
        if (!inputFile) {
          inputFile = arg;
        } else {
          console.error(chalk.red(`Error: Unknown argument '${arg}'`));
          process.exit(1);
        }
    }
  }

  if (!inputFile) {
    console.error(chalk.red("Error: Input file is required"));
    return null;
  }

  return { inputFile, options };
}

function validateInputFile(filePath: string): void {
  validateFileAccess(filePath);
}

async function processFile(
  inputFilePath: string,
  options: CliOptions,
): Promise<void> {
  validateInputFile(inputFilePath);

  const outputFilePath =
    options.output ||
    path.join(
      path.dirname(inputFilePath),
      path.basename(inputFilePath, path.extname(inputFilePath)),
    );

  try {
    const rawContent = await readFileOptimized(inputFilePath);

    if (rawContent.trim().length === 0) {
      throw new Error("Input file contains only whitespace");
    }

    const processedContent = rawContent.replace(
      /Preamp:\s*[-+]?[\d.]+\s*dB\s*/gi,
      "",
    );

    const parsedResult = parseFilters(processedContent);

    if (!options.validate) {
      await writeFileOptimized(
        outputFilePath,
        JSON.stringify(parsedResult.data, null, 2),
      );

      if (!options.quiet) {
        console.info(
          chalk.green(
            `✓ Successfully converted ${chalk.cyan(inputFilePath)} to ${chalk.cyan(outputFilePath)}`,
          ),
        );
        console.info(
          chalk.green(
            `✓ Parsed ${chalk.yellow(parsedResult.filterCount.toString())} filters in ${chalk.yellow(parsedResult.processingTime.toFixed(2))}ms`,
          ),
        );
        console.info(chalk.blue("✓ Generated settings for cDSP Parametric EQ"));
      }
    } else {
      if (!options.quiet) {
        console.info(
          chalk.green(`✓ Input file ${chalk.cyan(inputFilePath)} is valid`),
        );
        console.info(
          chalk.green(
            `✓ Parsed ${chalk.yellow(parsedResult.filterCount.toString())} filters in ${chalk.yellow(parsedResult.processingTime.toFixed(2))}ms`,
          ),
        );
        console.info(chalk.blue("✓ Generated settings for cDSP Parametric EQ"));
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`✗ Error processing file: ${error.message}`));
    } else {
      console.error(
        chalk.red("✗ Unknown error occurred while processing file"),
      );
    }
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const parsed = parseArguments();

  if (!parsed) {
    console.error(
      chalk.red(
        "Usage: apo2cdsp <input-file> [--output <output-file>] [--validate] [--quiet]",
      ),
    );
    console.error(chalk.yellow("Use 'apo2cdsp --help' for more information"));
    process.exit(1);
  }

  const { inputFile, options } = parsed;

  try {
    await processFile(inputFile, options);
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(`✗ ${error.message}`));
    } else {
      console.error(chalk.red("✗ Unknown error occurred"));
    }
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
