import fs from 'fs-extra';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const jetsonDir = path.join(rootDir, 'jetson');
const packageDir = path.join(rootDir, 'packages');

async function packageJetson() {
    try {
        // Ensure directories exist
        await fs.ensureDir(packageDir);
        
        // Create a file to stream archive data to
        const output = fs.createWriteStream(path.join(packageDir, 'servo-configurator-jetson.zip'));
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        // Listen for archive events
        output.on('close', () => {
            console.log(`Jetson package created: ${archive.pointer()} total bytes`);
        });

        archive.on('error', (err) => {
            throw err;
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add the Jetson-specific files
        archive.directory(jetsonDir, 'jetson');

        // Add documentation
        const docsDir = path.join(rootDir, 'docs');
        if (fs.existsSync(docsDir)) {
            archive.directory(docsDir, 'docs');
        }

        // Add necessary files
        const filesToInclude = [
            'README.md',
            'LICENSE'
        ];

        for (const file of filesToInclude) {
            const filePath = path.join(rootDir, file);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: file });
            }
        }

        // Create version file
        const packageJson = await fs.readJson(path.join(rootDir, 'package.json'));
        const versionInfo = {
            version: packageJson.version,
            timestamp: new Date().toISOString(),
            platform: 'jetson'
        };
        
        archive.append(JSON.stringify(versionInfo, null, 2), { name: 'version.json' });

        // Finalize the archive
        await archive.finalize();

    } catch (error) {
        console.error('Error packaging Jetson files:', error);
        process.exit(1);
    }
}

packageJetson();
