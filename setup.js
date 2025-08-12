#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 LangChain Chat Agent Setup');
console.log('=============================\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Check if .env file exists
    const envPath = path.join(__dirname, '.env');
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
      console.log('✅ .env file already exists');
      const overwrite = await question('Do you want to overwrite it? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }
    
    // Get OpenAI API key
    console.log('\n📝 OpenAI API Key Setup');
    console.log('You can get your API key from: https://platform.openai.com/api-keys');
    const apiKey = await question('Enter your OpenAI API key: ');
    
    if (!apiKey.trim()) {
      console.log('❌ API key is required. Setup cancelled.');
      rl.close();
      return;
    }
    
    if (!apiKey.startsWith('sk-')) {
      console.log('⚠️  Warning: API key should start with "sk-". Please verify your key.');
      const continueAnyway = await question('Continue anyway? (y/N): ');
      if (continueAnyway.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }
    
    // Create .env file
    const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=${apiKey}

# Server Configuration
PORT=3000
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    
    // Check .gitignore
    const gitignorePath = path.join(__dirname, '.gitignore');
    const gitignoreExists = fs.existsSync(gitignorePath);
    
    if (gitignoreExists) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.env')) {
        console.log('⚠️  Warning: .env is not in .gitignore. Adding it now...');
        fs.appendFileSync(gitignorePath, '\n.env\n');
        console.log('✅ Added .env to .gitignore');
      } else {
        console.log('✅ .env is already in .gitignore');
      }
    } else {
      console.log('⚠️  Warning: .gitignore file not found. Creating one...');
      fs.writeFileSync(gitignorePath, 'node_modules\n.env\n');
      console.log('✅ Created .gitignore with .env protection');
    }
    
    console.log('\n🎉 Setup complete! You can now run:');
    console.log('  npm start     # Command line interface');
    console.log('  npm run web   # Web interface');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setup();
