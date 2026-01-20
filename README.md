# apo2cdsp-parametriceq

A high-performance CLI tool that parses EqualizerAPO parametric EQ filter data from text files and converts it to JSON format for use with cDSP (CamillaDSP).

## Features

- 🚀 **Performance Optimized**: Handles files efficiently with streaming for large files
- 🛡️ **Robust Validation**: Comprehensive input validation with detailed error messages
- 📋 **User-Friendly CLI**: Full command-line interface with help, version, and multiple options
- ⚡ **Production Ready**: Built as a standalone executable with proper error handling
- 🔍 **Validation Mode**: Test files without creating output
- 📊 **Processing Stats**: Detailed timing and filter count information

## Installation

### Option 1: Download Executable (Recommended)

1. Download `apo2cdsp` executable from releases
2. Make it executable: `chmod +x apo2cdsp`
3. Move to your PATH: `sudo mv apo2cdsp /usr/local/bin/`

### Option 2: Build from Source

```bash
git clone <repository-url>
cd apo2cdsp-parametriceq
bun install
bun run build
./apo2cdsp --help
```

## Usage

### Basic Usage

```bash
apo2cdsp filters.txt
```

### With Custom Output

```bash
apo2cdsp filters.txt -o output.json
```

### Validate Only (No Output File)

```bash
apo2cdsp filters.txt --validate
```

### Quiet Mode (No Success Messages)

```bash
apo2cdsp filters.txt --quiet
```

### Help and Version

```bash
apo2cdsp --help
apo2cdsp --version
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

The tool expects EqualizerAPO ParametricEq filter data in this format:

```
Filter 1: ON PK Fc  20.0 Hz Gain  2.5 dB Q 1.00
Filter 2: ON PK Fc  50.0 Hz Gain -1.2 dB Q 0.70
Filter 3: ON PK Fc 100.0 Hz Gain  0.0 dB Q 1.41
...
Filter 10: ON PK Fc 20000.0 Hz Gain -0.5 dB Q 0.50
```

## Output Format

The output is a JSON object with specific key mappings for cDSP compatibility:

```json
{
  "0": 2.5,    // Filter 1 Gain
  "1": -1.2,   // Filter 2 Gain
  ...
  "10": 20,    // Filter 1 Frequency (Hz)
  "11": 50,    // Filter 2 Frequency (Hz)
  ...
  "20": 1.0,   // Filter 1 Q Factor
  "21": 0.7,   // Filter 2 Q Factor
  ...
  "30": 3,
  "31": 4,
  ...
  "1024": 0
}
```

## Performance

- **Small files (< 1MB)**: Synchronous processing for maximum speed
- **Large files (≥ 1MB)**: Streaming processing to minimize memory usage
- **Maximum file size**: 10MB (configurable)
- **Processing time**: Typically < 10ms for standard EQ configurations

## Error Handling

The tool provides detailed error messages for:

- Invalid file formats
- Missing or unreadable files
- Incorrect filter specifications
- Out-of-range parameter values
- File size limitations

## Development

### Using Makefile (Recommended)

```bash
# Install dependencies and setup
make setup

# Development mode with file
make dev FILE=filters.txt

# Build production executable
make build

# Clean build artifacts
make clean

# Lint and fix code
make lint-fix
make format-fix

# Run tests (when available)
make test

# Install globally
make install-global

# Create release package
make package

# Show all available commands
make help
```

### Using Bun Directly

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev filters.txt

# Lint code
bun run lint

# Format code
bun run format:fix

# Build production executable
bun run build

# Clean build artifacts
bun run clean
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Requirements

- Bun runtime (for development)
- No runtime dependencies for the built executable

## Troubleshooting

### "File too large" error

- Reduce input file size or split into multiple files
- Maximum supported size is 10MB for performance reasons

### "Invalid filter format" error

- Ensure the file follows the exact EqualizerAPO ParametricEq format
- Check for missing spaces, incorrect units, or malformed lines

### "Expected 10 filters" error

- The tool requires exactly 10 filters for cDSP compatibility
- Add or remove filters to match the required count
