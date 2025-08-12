# Installation Guide

This guide will walk you through setting up the LangChain Chat Agent on your machine, from prerequisites to running your first chat.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  - Verify npm: `npm --version`

- **Git** (optional, for cloning)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Required Accounts

- **OpenAI API Account**
  - Sign up at [platform.openai.com](https://platform.openai.com/)
  - Generate an API key in your account settings
  - Ensure you have sufficient credits (GPT-3.5-turbo is very affordable)

## 🚀 Installation Steps

### Step 1: Download the Project

**Option A: Clone the Repository**
```bash
git clone <repository-url>
cd lang-chain-agent
```

**Option B: Download and Extract**
1. Download the project files
2. Extract to a folder
3. Open terminal/command prompt
4. Navigate to the project folder: `cd path/to/lang-chain-agent`

### Step 2: Install Dependencies

```bash
npm install
```

This command will:
- Install all required packages listed in `package.json`
- Create a `node_modules` folder
- Generate `package-lock.json` for dependency locking

**Expected Output:**
```
added 123 packages, and audited 124 packages in 1.2s
found 0 vulnerabilities
```

### Step 3: Configure Environment Variables

You need to set up your OpenAI API key. Choose one of these methods:

#### Method A: Environment Variable (Recommended)

**On macOS/Linux:**
```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

**On Windows (Command Prompt):**
```cmd
set OPENAI_API_KEY=your_openai_api_key_here
```

**On Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="your_openai_api_key_here"
```

#### Method B: .env File

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file:
   ```bash
   # On macOS/Linux
   nano .env
   
   # On Windows
   notepad .env
   ```

3. Add your API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Step 4: Verify Installation

Run the test script to ensure everything is working:

```bash
npm test
```

**Expected Output:**
```
✅ Test completed successfully!
```

## 🔧 Configuration Options

### API Key Security

**Important**: Never commit your API key to version control!

- Add `.env` to your `.gitignore` file
- Use environment variables in production
- Rotate your API key regularly

### Optional: Customize Settings

You can modify these settings in `index.js`:

```javascript
// Model configuration
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",  // Change model here
  temperature: 0.7,            // Adjust creativity (0.0-1.0)
});

// Document processing
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,             // Chunk size in characters
  chunkOverlap: 200,           // Overlap between chunks
});

// Retrieval settings
this.retriever = this.vectorStore.asRetriever({
  k: 3,                        // Number of chunks to retrieve
});
```

## 🏃‍♂️ Running the Application

### Option 1: Command Line Interface

```bash
npm start
```

**Features:**
- Lightweight and fast
- No browser required
- Perfect for development and testing

### Option 2: Web Interface (Recommended)

```bash
npm run web
```

Then open your browser and go to: `http://localhost:3000`

**Features:**
- Modern, responsive UI
- Better user experience
- Real-time typing indicators

### Option 3: Development Mode

```bash
npm run dev
```

**Features:**
- Auto-restart on file changes
- Perfect for development
- Command line interface with hot reload

## 🧪 Testing Your Installation

### Quick Test

1. Start the application:
   ```bash
   npm run web
   ```

2. Open your browser to `http://localhost:3000`

3. Ask a test question:
   ```
   What is artificial intelligence?
   ```

4. You should receive a response based on the sample document.

### Troubleshooting Test

If you encounter issues, run the test script:

```bash
npm test
```

This will verify:
- Dependencies are installed correctly
- API key is configured
- Basic functionality works

## 🔍 Verification Checklist

Before proceeding, ensure:

- [ ] Node.js version 18+ is installed
- [ ] All dependencies are installed (`npm install` completed)
- [ ] OpenAI API key is configured
- [ ] Application starts without errors
- [ ] You can ask a question and receive a response
- [ ] Both CLI and web interfaces work

## 🚨 Common Installation Issues

### Issue: "Module not found" errors

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "OpenAI API key is required"

**Solution:**
1. Verify your API key is set correctly
2. Check that the key is valid in your OpenAI account
3. Ensure you have sufficient credits

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run web
```

### Issue: "Permission denied" errors

**Solution:**
```bash
# On macOS/Linux, you might need sudo
sudo npm install

# Or fix npm permissions
npm config set prefix ~/.npm-global
```

## 📱 Platform-Specific Notes

### macOS
- Works out of the box with standard installation
- Use `brew install node` for easy Node.js installation

### Windows
- Ensure you're using Command Prompt or PowerShell as Administrator
- Use Windows Subsystem for Linux (WSL) for better experience

### Linux
- Use your distribution's package manager for Node.js
- Ubuntu/Debian: `sudo apt install nodejs npm`
- CentOS/RHEL: `sudo yum install nodejs npm`

## 🔄 Updating the Application

To update to the latest version:

```bash
# Pull latest changes (if using git)
git pull origin main

# Reinstall dependencies
npm install

# Test the installation
npm test
```

## 📞 Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Verify your OpenAI API key is valid
3. Ensure all prerequisites are met
4. Check the console output for error messages

---

**Next Steps**: Once installation is complete, read the [Quick Start Guide](./quick-start.md) to begin using the application.
