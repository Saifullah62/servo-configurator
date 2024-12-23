import fs from 'fs-extra';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const packageDir = path.join(rootDir, 'packages');

async function packageWeb() {
    try {
        // Ensure directories exist
        await fs.ensureDir(packageDir);
        
        // Create a file to stream archive data to
        const output = fs.createWriteStream(path.join(packageDir, 'servo-configurator-web.zip'));
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        // Listen for archive events
        output.on('close', () => {
            console.log(`Web package created: ${archive.pointer()} total bytes`);
        });

        archive.on('error', (err) => {
            throw err;
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add the built files
        archive.directory(distDir, 'dist');

        // Add necessary files
        const filesToInclude = [
            'README.md',
            'LICENSE',
            'package.json'
        ];

        for (const file of filesToInclude) {
            const filePath = path.join(rootDir, file);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: file });
            }
        }

        // Finalize the archive
        await archive.finalize();

    } catch (error) {
        console.error('Error packaging web files:', error);
        process.exit(1);
    }
}

packageWeb();
