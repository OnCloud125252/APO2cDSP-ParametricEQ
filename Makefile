# Makefile for Parse EqualizerAPO to cDSP CLI Tool

# Configuration
BUN ?= bun
EXECUTABLE_NAME = apo2cdsp
MAIN_FILE = index.ts
BUILD_DIR = dist

# Default target
all: build

# Build production executable
build:
	@echo "🏗️  Building production executable..."
	mkdir -p $(BUILD_DIR)
	$(BUN) build --compile --minify --target bun $(MAIN_FILE) --outfile $(BUILD_DIR)/$(EXECUTABLE_NAME)
	@echo "✅ Build complete: $(BUILD_DIR)/$(EXECUTABLE_NAME)"

# Show help
help:
	@echo "$(EXECUTABLE_NAME)-parametriceq - Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  build              Build production executable"
	@echo "  install-global     Install CLI globally"
	@echo "  uninstall-global   Uninstall CLI globally"
	@echo "  check-tools        Check if required tools are installed"
	@echo "  info               Show project information"
	@echo "  help               Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make build              # Build the executable"
	@echo "  make install-global     # Install globally"

# Install the CLI globally
install-global: build
	@echo "🌍 Installing CLI globally..."
	sudo mv $(BUILD_DIR)/$(EXECUTABLE_NAME) /usr/local/bin/
	@echo "✅ Installation complete. Run '$(EXECUTABLE_NAME) --help' to get started."

# Uninstall the CLI globally
uninstall-global:
	@echo "🗑️  Uninstalling CLI globally..."
	sudo rm -f /usr/local/bin/$(EXECUTABLE_NAME)
	@echo "✅ Uninstallation complete"

# Check if required tools are installed
check-tools:
	@echo "🔧 Checking required tools..."
	@command -v $(BUN) >/dev/null 2>&1 || { echo "❌ Bun is required but not installed. Please install Bun first."; exit 1; }
	@echo "✅ All required tools are installed"

# Project info
info:
info:
	@echo "📊 Project Information:"
	@echo "  Name: $(EXECUTABLE_NAME)-parametriceq"
	@echo "  Main: $(MAIN_FILE)"
	@echo "  Executable: $(EXECUTABLE_NAME)"
	@echo "  Bun version: $(shell $(BUN) --version 2>/dev/null || echo 'Not found')"
	@echo "  OS: $(shell uname -s)"
	@echo "  Arch: $(shell uname -m)"

# Phony targets
.PHONY: all build install-global uninstall-global help check-tools info
