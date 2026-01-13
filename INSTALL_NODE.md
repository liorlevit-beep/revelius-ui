# Installing Node.js on macOS

You have several options to install Node.js. Choose the method that works best for you:

## Option 1: Official Installer (Easiest)

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer and follow the instructions
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Option 2: Homebrew (Recommended for Developers)

If you have Homebrew installed:

```bash
brew install node
```

If you don't have Homebrew, install it first:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Node.js:
```bash
brew install node
```

## Option 3: nvm (Node Version Manager) - Best for Managing Multiple Versions

Install nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Restart your terminal or run:
```bash
source ~/.zshrc
```

Then install Node.js:
```bash
nvm install --lts
nvm use --lts
```

## Verify Installation

After installation, verify it works:

```bash
node --version
npm --version
```

You should see version numbers for both commands.

## Next Steps

Once Node.js is installed, return to the project and run:

```bash
cd /Users/liorlevit/Documents/Dev
npm install
npm run dev
```
