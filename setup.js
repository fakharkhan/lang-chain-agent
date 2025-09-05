#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 LangChain Chat Agent Setup');
console.log('=============================\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (ans) => resolve(ans ?? ''));
  });
}

async function setup() {
  try {
    // Check if .env file exists
    const envPath = path.join(__dirname, '.env');
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
      console.log('✅ .env file already exists');
      const overwrite = (await question('Do you want to overwrite it? (y/N): ')).trim().toLowerCase();
      if (overwrite !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    // Choose provider
    console.log('\n🧠 Choose your LLM provider');
    console.log('  1) Ollama (local, recommended)');
    console.log('  2) OpenAI (API key required)');
    const choice = (await question('Select provider [1]: ')).trim();
    const provider = choice === '2' ? 'openai' : 'ollama';

    let envContent = '';
    if (provider === 'openai') {
      // Get OpenAI API key
      console.log('\n📝 OpenAI API Key Setup');
      console.log('Get your API key from: https://platform.openai.com/api-keys');
      const apiKey = (await question('Enter your OpenAI API key: ')).trim();

      if (!apiKey) {
        console.log('❌ API key is required for OpenAI. Setup cancelled.');
        rl.close();
        return;
      }

      envContent = `# Provider\nLLM_PROVIDER=openai\n\n# OpenAI API Configuration\nOPENAI_API_KEY=${apiKey}\n\n# Server Configuration\nPORT=3000\n`;
    } else {
      // Ollama defaults
      console.log('\n🧰 Ollama local setup');
      console.log('Ensure Ollama is installed and running: https://ollama.com');
      const baseUrl = (await question('Ollama base URL [http://localhost:11434]: ')).trim() || 'http://localhost:11434';
      const chatModel = (await question('Chat model [llama3.1]: ')).trim() || 'llama3.1';
      const embedModel = (await question('Embedding model [nomic-embed-text]: ')).trim() || 'nomic-embed-text';

      envContent = `# Provider\nLLM_PROVIDER=ollama\n\n# Ollama Configuration\nOLLAMA_BASE_URL=${baseUrl}\nOLLAMA_MODEL=${chatModel}\nOLLAMA_EMBED_MODEL=${embedModel}\n\n# Server Configuration\nPORT=3000\n`;
    }

    // Create .env file
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
