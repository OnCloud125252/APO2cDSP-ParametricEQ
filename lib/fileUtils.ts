import * as fs from "node:fs";
import chalk from "chalk";

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const STREAM_THRESHOLD = 1024 * 1024; // 1MB

export async function readFileOptimized(
  filePath: string,
  maxSize: number = DEFAULT_MAX_SIZE,
): Promise<string> {
  const stats = fs.statSync(filePath);

  if (stats.size > maxSize) {
    throw new Error(
      chalk.red(
        `File is too large: ${Math.round(stats.size / 1024 / 1024)}MB. Maximum size is ${maxSize / 1024 / 1024}MB.`,
      ),
    );
  }

  if (stats.size === 0) {
    throw new Error(chalk.red("File is empty"));
  }

  // For smaller files, use synchronous reading for better performance
  if (stats.size < STREAM_THRESHOLD) {
    return fs.readFileSync(filePath, "utf8");
  }

  // For larger files, use streams
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });

    stream.on("data", (chunk: string) => {
      chunks.push(chunk);
    });

    stream.on("end", () => {
      resolve(chunks.join(""));
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}

export async function writeFileOptimized(
  filePath: string,
  content: string,
): Promise<void> {
  const contentSize = Buffer.byteLength(content, "utf8");

  // For smaller content, use synchronous writing for better performance
  if (contentSize < STREAM_THRESHOLD) {
    fs.writeFileSync(filePath, content, "utf8");
    return;
  }

  // For larger content, use streams
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath, { encoding: "utf8" });

    stream.write(content);
    stream.end();

    stream.on("finish", () => {
      resolve();
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
}

export function validateFileAccess(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(chalk.red(`File does not exist: ${filePath}`));
  }

  try {
    fs.accessSync(filePath, fs.constants.R_OK);
  } catch {
    throw new Error(chalk.red(`File is not readable: ${filePath}`));
  }

  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    throw new Error(chalk.red(`Path is not a file: ${filePath}`));
  }
}
