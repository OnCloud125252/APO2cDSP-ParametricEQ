# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this repository.

## Project Overview

This is a Bun-based TypeScript project called apo2cdsp-parametriceq that parses EqualizerAPO parametric EQ filter data from text files and converts it to JSON format. The main functionality is in `index.ts` which reads filter specifications, extracts frequency/gain/Q values, and outputs them in a structured format.

## Build and Development Commands

### Package Management

- **Install dependencies**: `bun install`
- **Add dependency**: `bun add <package>`
- **Remove dependency**: `bun remove <package>`

### Code Quality

- **Lint code**: `bun run lint` (runs Biome check)
- **Fix linting issues**: `bun run lint:fix` (runs Biome check --fix)
- **Fix linting unsafely**: `bun run lint:fix-unsafe` (runs Biome check --fix --unsafe)
- **Format code**: `bun run format` (runs Biome format)
- **Format and fix**: `bun run format:fix` (runs Biome format --write)

### Running the Application

- **Run main script**: `bun parse.ts`
- **Run with TypeScript directly**: `bun run parse.ts`

### Testing

No test framework is currently configured. Consider adding:

- `bun add -d @types/bun` for Bun's test framework
- `bun test` to run tests (once configured)

## Code Style Guidelines

### TypeScript Configuration

- Target: ESNext
- Module: Preserve (for bundler compatibility)
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
- **Files**: kebab-case for files, PascalCase for TypeScript files containing classes
- **Interfaces**: Prefix with `I` only if necessary (prefer descriptive names)

### Code Structure

- Use meaningful variable names, avoid single letters except for loop indices
- Always use `const`/`let`, never `var`
- Prefer async/await over promise chains
- Use block statements for control flow (no single-line if/for)
- Add JSDoc comments for complex functions or interfaces

### Error Handling

- Use try/catch blocks for file operations and external calls
- Prefer specific error types over generic `Error`
- Use appropriate console methods: `console.error()` for errors, `console.info()` for success messages
- Include context in error messages

### Type Safety

- Enable strict TypeScript mode
- Use interfaces for object shapes
- Prefer explicit return types for public functions
- Use `Math.fround()` for 32-bit float precision when needed (as seen in parse.ts)
- Use type guards for runtime type checking

### File Organization

- Keep main logic in root `parse.ts` for this simple project
- Add utility functions to separate files if the project grows
- Use absolute paths with `path.join(__dirname, ...)` for file operations
- Separate data structures (interfaces) from implementation

## Development Workflow

1. Always run `bun run lint:fix` before committing
2. Test the main script with sample data before changes
3. Check that output JSON format matches expected structure
4. Verify file paths and error handling
5. Use `bun run format:fix` to maintain consistent formatting

## Project-Specific Notes

- The parser expects filter data in format: "Filter <id>: <state> <type> Fc <freq> Hz Gain <gain> dB Q <q>"
- Output maps to specific index ranges: 0-9 (gain), 10-19 (frequency), 20-29 (Q factor)
- Uses `Math.fround()` for 32-bit float precision consistency
- Frequencies are rounded to integers in output
- Input file: `filters.txt`, Output file: `output`
