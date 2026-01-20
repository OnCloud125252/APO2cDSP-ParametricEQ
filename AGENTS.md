# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is a Bun-based TypeScript project called `apo2cdsp-parametriceq` that parses EqualizerAPO parametric EQ filter data from text files and converts it to JSON format for use with cDSP (CamillaDSP).

The project is structured with a main entry point in `index.ts` and supporting logic in the `lib/` directory.

## Build and Development Commands

### Package Management

- **Install dependencies**: `bun install`
- **Add dependency**: `bun add <package>`
- **Remove dependency**: `bun remove <package>`

### Code Quality

- **Lint and format check**: `bun run check` (runs Biome check)
- **Fix issues**: `bun run check:fix` (runs Biome check --fix)
- **Fix issues unsafely**: `bun run check:fix-unsafe` (runs Biome check --fix --unsafe)
- **Type check**: `bun run typecheck`

### Running the Application

- **Run in development**: `bun run dev <input-file>` or `bun index.ts <input-file>`
- **Build production executable**: `bun run build` (outputs to `dist/apo2cdsp`)

### CLI Usage

- **Input file**: The first positional argument is the input file path.
- **Output file**: `-o <path>` or `--output <path>` to specify output JSON path.
- **Validation only**: `--validate` to check input without writing output.
- **Quiet mode**: `--quiet` to suppress success messages.
- **Help/Version**: `-h`, `--help` or `-v`, `--version`.

### Testing

- **Run tests**: `bun test`

## Code Style Guidelines

### TypeScript Configuration

- Target: `ESNext`
- Module: `Preserve` (for bundler compatibility)
- Strict mode enabled
- No implicit any, no unchecked indexed access
- Use ESNext lib features

### Formatting (Biome)

- **Indentation**: 2 spaces (no tabs)
- **Line width**: 80 characters
- **Quotes**: Double quotes for strings/JSX
- **Semicolons**: Always
- **Trailing commas**: All (consistent)
- **Line endings**: LF
- **Bracket spacing**: Enabled
- **Arrow parentheses**: Always

### Import Style

- Use `import * as fs from "node:fs";` for Node.js built-in modules
- Prefer named imports over default imports when possible
- Group imports: built-in modules first, then external packages, then local modules
- Use type-only imports (`import type`) when only types are needed

### Naming Conventions

- **Variables/Functions**: camelCase
- **Classes/Interfaces**: PascalCase
- **Constants**: UPPER_SNAKE_CASE for truly constant values
- **Files**: kebab-case for utility files, `index.ts` for entry point

### Code Structure

- Main logic resides in `index.ts` (CLI handling) and `lib/` (core logic)
- `lib/fileUtils.ts`: Optimized file I/O operations (sync for small files, streams for large files)
- `lib/parseFilters.ts`: Core parsing and validation logic
- Use `Math.fround()` for 32-bit float precision consistency where required
- Frequencies are rounded to integers in output

### Error Handling

- Use custom error classes (e.g., `ParseError`) for domain-specific errors
- Use `try/catch` blocks in the CLI entry point to provide user-friendly error messages
- Use `chalk` for colorized console output (Red for errors, Green for success, Yellow/Blue for info)

## Development Workflow

1. Always run `bun run check:fix` before committing
2. Test the main script with sample data before changes
3. Check that output JSON format matches expected structure
4. Verify file paths and error handling
5. Ensure exactly 10 filters are present in the input as required by the parser

## Project-Specific Notes

- The parser expects filter data in format: `"Filter <id>: <state> <type> Fc <freq> Hz Gain <gain> dB Q <q>"`
- Preamp lines are automatically stripped before parsing.
- Output maps to specific index ranges: 
    - `0-9`: Gain (32-bit float, using `Math.fround`)
    - `10-19`: Frequency (integer, using `Math.round`)
    - `20-29`: Q factor (high precision float, rounded to 14 decimal places using `PRECISION_MULTIPLIER = 100000000000000`)
    - `30-49`: Static configuration values (indices 30-49 and 1024)
- Maximum supported file size: 10MB
- Stream threshold for file I/O: 1MB
