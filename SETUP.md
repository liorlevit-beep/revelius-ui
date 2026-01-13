# Local Development Setup Guide

This guide will help you set up the Revelius UI project for local development in VSCode.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher recommended)
   - Download from [nodejs.org](https://nodejs.org/)
   - Or install via Homebrew: `brew install node`

2. **Xcode Command Line Tools** (for Git)
   - Run: `xcode-select --install`
   - Or download from [Apple Developer](https://developer.apple.com/xcode/)

## Setup Steps

### 1. Install Node.js (if not already installed)

Check if Node.js is installed:
```bash
node --version
npm --version
```

If not installed, download and install from [nodejs.org](https://nodejs.org/)

### 2. Install Project Dependencies

Navigate to the project directory and install dependencies:

```bash
cd /Users/liorlevit/Documents/Dev
npm install
```

### 3. Set Up Git (Optional but Recommended)

If you want to use Git for version control:

```bash
git init
git remote add origin https://github.com/liorlevit-beep/revelius-ui.git
git branch -M main
```

### 4. Configure Environment Variables

Check if a `.env` file exists. If not, you may need to create one based on the project's requirements. Check `src/config/env.ts` for required environment variables.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## VSCode Extensions

The following extensions are recommended (you'll be prompted to install them when opening the project):

- **ESLint** - For code linting
- **Prettier** - For code formatting
- **Tailwind CSS IntelliSense** - For Tailwind CSS autocomplete
- **TypeScript and JavaScript Language Features** - Built-in TypeScript support

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Troubleshooting

### Git Issues
If you encounter Xcode command line tools errors, install them:
```bash
xcode-select --install
```

### Node.js Not Found
Make sure Node.js is installed and in your PATH. You may need to restart your terminal or VSCode after installation.

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port.

## Project Structure

- `src/` - Source code
- `src/components/` - React components
- `src/pages/` - Page components
- `src/api/` - API client code
- `public/` - Static assets
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Next Steps

1. Open the project in VSCode
2. Install recommended extensions when prompted
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start development
5. Open `http://localhost:5173` in your browser

Happy coding! 🚀
