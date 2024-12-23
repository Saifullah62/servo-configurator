import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_FILES = {
    root: [
        'package.json',
        'README.md',
        'LICENSE',
        'vite.config.ts',
        'tsconfig.json'
    ],
    src: [
        'App.tsx',
        'main.tsx',
        'index.css'
    ],
    jetson: [
        'server.py',
        'install.sh',
        'uninstall.sh',
        'requirements.txt',
        'config.yaml'
    ],
    docs: [
        'API_REFERENCE.md',
        'DEPLOYMENT.md',
        'DEVELOPER_GUIDE.md',
        'JETSON_SETUP.md',
        'USER_GUIDE.md'
    ]
};

async function validateFiles() {
    const errors = [];
    const warnings = [];

    // Check root files
    for (const file of REQUIRED_FILES.root) {
        if (!await fs.pathExists(path.join(rootDir, file))) {
            errors.push(`Missing required file: ${file}`);
        }
    }

    // Check src files
    for (const file of REQUIRED_FILES.src) {
        if (!await fs.pathExists(path.join(rootDir, 'src', file))) {
            errors.push(`Missing required source file: src/${file}`);
        }
    }

    // Check Jetson files
    for (const file of REQUIRED_FILES.jetson) {
        if (!await fs.pathExists(path.join(rootDir, 'jetson', file))) {
            errors.push(`Missing required Jetson file: jetson/${file}`);
        }
    }

    // Check documentation files
    for (const file of REQUIRED_FILES.docs) {
        if (!await fs.pathExists(path.join(rootDir, 'docs', file))) {
            errors.push(`Missing required documentation file: docs/${file}`);
        }
    }

    return { errors, warnings };
}

async function validateConfigs() {
    const errors = [];
    const warnings = [];

    try {
        // Validate package.json
        const packageJson = await fs.readJson(path.join(rootDir, 'package.json'));
        if (!packageJson.version) {
            errors.push('package.json missing version');
        }
        if (!packageJson.scripts?.build) {
            errors.push('package.json missing build script');
        }

        // Validate Jetson config.yaml
        const configPath = path.join(rootDir, 'jetson', 'config.yaml');
        const configContent = await fs.readFile(configPath, 'utf8');
        const config = yaml.parse(configContent);

        if (!config.server?.port) {
            errors.push('config.yaml missing server port');
        }
        if (!config.i2c?.bus) {
            errors.push('config.yaml missing I2C bus configuration');
        }

        // Validate TypeScript config
        const tsConfig = await fs.readJson(path.join(rootDir, 'tsconfig.json'));
        if (!tsConfig.compilerOptions) {
            errors.push('tsconfig.json missing compiler options');
        }

    } catch (error) {
        errors.push(`Configuration validation error: ${error.message}`);
    }

    return { errors, warnings };
}

async function validateDependencies() {
    const errors = [];
    const warnings = [];

    try {
        const packageJson = await fs.readJson(path.join(rootDir, 'package.json'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Check for outdated React version
        if (dependencies.react && !dependencies.react.startsWith('^18')) {
            warnings.push('Consider upgrading to React 18 or later');
        }

        // Check Python requirements
        const requirementsPath = path.join(rootDir, 'jetson', 'requirements.txt');
        const requirements = await fs.readFile(requirementsPath, 'utf8');
        
        if (!requirements.includes('adafruit-circuitpython-servokit')) {
            errors.push('Missing required Python package: adafruit-circuitpython-servokit');
        }

    } catch (error) {
        errors.push(`Dependency validation error: ${error.message}`);
    }

    return { errors, warnings };
}

async function validatePackage() {
    console.log('Validating package...\n');

    const validations = await Promise.all([
        validateFiles(),
        validateConfigs(),
        validateDependencies()
    ]);

    const errors = validations.flatMap(v => v.errors);
    const warnings = validations.flatMap(v => v.warnings);

    if (errors.length > 0) {
        console.error('\nValidation Errors:');
        errors.forEach(error => console.error(`❌ ${error}`));
    }

    if (warnings.length > 0) {
        console.warn('\nValidation Warnings:');
        warnings.forEach(warning => console.warn(`⚠️ ${warning}`));
    }

    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Package validation successful!');
    }

    if (errors.length > 0) {
        process.exit(1);
    }
}

validatePackage();
