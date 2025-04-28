# Babraham Bioinformatics FastQC Software Package

This package provides FastQC binaries for the Platforma Backend system.

## Reference
https://www.bioinformatics.babraham.ac.uk/projects/fastqc/

## Installation

```bash
npm install @platforma-open/babraham.software-fastqc
```

## Usage

The package provides FastQC binaries for various platforms. The binaries are automatically selected based on the host system.

## Version Upgrade Instructions

To upgrade to a new version of FastQC:

1. Download the new FastQC version:
   - Go to https://www.bioinformatics.babraham.ac.uk/projects/fastqc/
   - Download the latest version (e.g., fastqc_v0.12.1.zip)

2. Prepare the binaries:
   - Create the `dld` directory if it doesn't exist:
     ```bash
     mkdir -p dld
     ```
   - Extract the downloaded archive to the `dld` directory:
     ```bash
     unzip fastqc_v0.12.1.zip -d dld/
     ```
   - Rename the extracted directory to match the expected structure:
     ```bash
     mv dld/FastQC dld/fastqc
     ```

3. Update package.json:
   - Update the version in `block-software.entrypoints.main.binary.artifact.version` to the new version (e.g., "0.12.1")
   - Bump the package version in the root `version` field if needed

4. Build and publish:
   ```bash
   npm run pkg:build
   npm run pkg:publish
   ```

Note: FastQC is a Java application, so the package includes the Java runtime environment. The build process will handle the necessary Java configuration automatically.

## Supported Platforms

- Linux (x64, aarch64)
- macOS (x64, aarch64)
- Windows (x64)

## License

UNLICENSED 
