# apo2cdsp-parametriceq

A simple CLI tool that parses EqualizerAPO parametric EQ filter data from text files and converts it to JSON format for use with cDSP (CamillaDSP).

## Installation

### Build from Source

Ensure you have [Bun](https://bun.sh) installed.

```bash
git clone <repository-url>
cd apo2cdsp-parametriceq
bun install
bun run build
./dist/apo2cdsp --help
```

## Usage

### Basic Usage

Converts `filters.txt` to a JSON file named `filters` (no extension) in the same directory.

```bash
bun run dev filters.txt
# or if using the built binary
./dist/apo2cdsp filters.txt
```

### With Custom Output

```bash
./dist/apo2cdsp filters.txt -o output.json
```

### Validate Only

Check if a file is valid without writing any output.

```bash
./dist/apo2cdsp filters.txt --validate
```

### Quiet Mode

Suppress success messages (useful for scripting).

```bash
./dist/apo2cdsp filters.txt --quiet
```

## CLI Options

| Option                | Description                                      |
| --------------------- | ------------------------------------------------ |
| `-h, --help`          | Show help message                                |
| `-v, --version`       | Show version information                         |
| `-o, --output <path>` | Specify output file path                         |
| `--validate`          | Only validate input file without creating output |
| `--quiet`             | Suppress success messages                        |

## Input Format

The tool expects EqualizerAPO ParametricEq filter data (exactly 10 filters) in this format:

```
Preamp: -5.16 dB
Filter 1: ON LSC Fc 105.0 Hz Gain -2.2 dB Q 0.70
Filter 2: ON PK Fc 92.7 Hz Gain -0.8 dB Q 1.79
Filter 3: ON PK Fc 183.2 Hz Gain -5.0 dB Q 0.64
Filter 4: ON PK Fc 830.9 Hz Gain 3.2 dB Q 1.19
Filter 5: ON PK Fc 1686.3 Hz Gain -1.4 dB Q 3.48
Filter 6: ON PK Fc 3525.5 Hz Gain 5.1 dB Q 2.39
Filter 7: ON PK Fc 4807.7 Hz Gain -4.4 dB Q 5.38
Filter 8: ON PK Fc 6197.8 Hz Gain 4.3 dB Q 4.51
Filter 9: ON PK Fc 10000.0 Hz Gain 2.0 dB Q 1.92
Filter 10: ON HSC Fc 10000.0 Hz Gain 4.1 dB Q 0.70
```

*Note: Any `Preamp` lines are automatically ignored during processing.*

## Output Format

The output is a JSON object with specific key mappings for cDSP compatibility:

- **0-9**: Gain values (32-bit precision)
- **10-19**: Frequencies (rounded to integers)
- **20-29**: Q factors (high precision)
- **30-49**: Static configuration values for cDSP
- **1024**: Static value (0)

## Development

### Available Scripts

- `bun run build`: Build a standalone executable in `dist/`
- `bun run dev`: Run the project in development mode
- `bun run check`: Run Biome linting checks
- `bun run check:fix`: Automatically fix linting issues
- `bun run check:fix-unsafe`: Automatically fix linting issues with unsafe fixes
- `bun run typecheck`: Run TypeScript type checking

## Project Structure

- `index.ts`: CLI entry point and argument parsing
- `lib/fileUtils.ts`: Optimized file read/write operations
- `lib/parseFilters.ts`: Core parsing logic and validation
