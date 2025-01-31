#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const unzipper = require('unzipper');

const scriptDir = __dirname;
const packageRoot = path.resolve(scriptDir, '..');
const dstRoot = path.join(packageRoot, 'dld');
const dstDataDir = path.join(dstRoot, 'fastqc');

function log(message) {
    console.log(message);
}

const version = process.argv[2];
if (!version) {
    log('Usage: node unpack.js <version>');
    log('Example: node unpack.js 0.12.1');
    process.exit(1);
}

const downloadUrl = `https://www.bioinformatics.babraham.ac.uk/projects/fastqc/fastqc_v${version}.zip`;
const localZipPath = path.join(dstRoot, `fastqc_v${version}.zip`);

if (!fs.existsSync(dstRoot)) {
    fs.mkdirSync(dstRoot, { recursive: true });
}

function downloadFile(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file).on('finish', () => {
                file.close(() => cb(null)); // Close and proceed without error
            });
        } else {
            file.close(() => {
                fs.unlinkSync(dest); // Delete file on error
                cb(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            });
        }
    }).on('error', (err) => {
        file.close(() => {
            fs.unlinkSync(dest); // Delete file on error
            cb(err.message);
        });
    });
}

downloadFile(downloadUrl, localZipPath, (err) => {
    if (err) {
        log(err);
        return;
    }

    log(`Downloaded '${localZipPath}'`);

    fs.createReadStream(localZipPath)
        .pipe(unzipper.Extract({ path: dstRoot }))
        .on('close', () => {
            log('Extraction complete.');

            const extractedDirPath = path.join(dstRoot, 'FastQC');
            const targetDirPath = dstDataDir;

            if (fs.existsSync(extractedDirPath)) {
                try {
                    fs.renameSync(extractedDirPath, targetDirPath);
                    log(`Renamed '${extractedDirPath}' to '${targetDirPath}'`);
                } catch (error) {
                    log(`Error renaming directory: ${error}`);
                }
            } else {
                log(`Expected directory '${extractedDirPath}' not found.`);
            }

            fs.unlinkSync(localZipPath); // Optionally remove the zip file after extraction
        })
        .on('error', (error) => {
            log(`Error during extraction: ${error}`);
        });
});