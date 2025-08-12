# LangChain Chat Agent with RAG

A conversational AI agent built with LangChain.js that uses Retrieval Augmented Generation (RAG) to answer questions based on a sample document about Artificial Intelligence.

## Features

- 🤖 **Chat Interface**: Interactive command-line chat interface
- 📚 **RAG System**: Retrieval Augmented Generation using vector embeddings
- 💾 **Memory**: Maintains conversation history for context
- 🔍 **Document Processing**: Automatically splits and embeds documents
- 🎯 **Contextual Responses**: Answers questions based on the provided document content

## Prerequisites

- Node.js (version 18 or higher)
- OpenAI API key

## Installation

1. **Clone or download this project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key**:
   
   **Option 1: Interactive setup (Recommended)**
   ```bash
   npm run setup
   ```
   
   **Option 2: Environment variable**
   ```bash
   export OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Option 3: Manual .env file**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

## Usage

### Starting the Chat Agent

**Command Line Interface:**
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

**Web Interface (Recommended):**
```bash
npm run web
```

Then open your browser and go to: `http://localhost:3000`

The web interface provides a modern, responsive chat UI that you can use in any browser!

### Chat Commands

Once the agent is running, you can:

- **Ask questions**: Type any question about AI and the agent will answer based on the sample document
- **Clear history**: Type `clear` to reset the conversation
- **Get help**: Type `help` to see available commands
- **Exit**: Type `quit` or `exit` to close the application

### Example Questions

You can ask questions like:
- "What is artificial intelligence?"
- "What are the different types of machine learning?"
- "How is AI used in healthcare?"
- "What are the ethical concerns with AI?"
- "When was the term AI first coined?"

## How It Works

1. **Document Processing**: The sample document about AI is loaded and split into chunks
2. **Vector Embeddings**: Each chunk is converted into vector embeddings using OpenAI's embedding model
3. **Retrieval**: When you ask a question, the system finds the most relevant document chunks
4. **Generation**: The AI model generates a response based on the retrieved context and conversation history

## Project Structure

```
lang-chain-agent/
├── index.js              # Main application file
├── sample_document.txt   # Sample AI document for RAG
├── package.json          # Dependencies and scripts
├── env.example          # Environment variables template
└── README.md            # This file
```

## Dependencies

- `@langchain/core`: Core LangChain functionality
- `@langchain/openai`: OpenAI integration
- `@langchain/community`: Community integrations
- `langchain`: Main LangChain library
- `dotenv`: Environment variable management

## Customization

### Using Your Own Document

To use a different document:

1. Replace the content in `sample_document.txt` with your own text
2. The system will automatically process and embed the new content

### Adjusting RAG Parameters

You can modify these parameters in `index.js`:

- **Chunk size**: Change `chunkSize` in the text splitter (default: 1000)
- **Chunk overlap**: Change `chunkOverlap` in the text splitter (default: 200)
- **Retrieval count**: Change `k` in the retriever (default: 3)
- **Model**: Change `modelName` to use different OpenAI models

## Security

⚠️ **Important**: This project uses OpenAI API keys. Never commit API keys to version control!

### API Key Setup

1. **Environment Variable** (Recommended):
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

2. **Local Development**:
   ```bash
   cp env.example .env
   # Edit .env and add your API key
   ```

For detailed security guidelines, see [docs/security.md](docs/security.md).

## Troubleshooting

### Common Issues

1. **"OpenAI API key is required"**
   - Make sure you've set your OpenAI API key correctly
   - Check that the API key is valid and has sufficient credits
   - Ensure you're using environment variables or a `.env` file

2. **"Error initializing chat agent"**
   - Verify your internet connection
   - Check that your OpenAI API key is working

3. **"Module not found" errors**
   - Run `npm install` to install dependencies
   - Make sure you're using Node.js version 18 or higher

4. **Git push blocked due to secrets**
   - Remove any hardcoded API keys from your code
   - Use environment variables instead
   - See the security guide for detailed instructions

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify your OpenAI API key is valid
3. Ensure all dependencies are installed correctly

## Author Information

**Name:** Fakhar Zaman Khan  
**Company:** SOFT PYRAMID  
**Email:** fakhar@softpyramid.com  
**Website:** softpyramid.com

**Contact for Appointment Assistance:**
- **USA:** +1 385 216 2631
- **Pakistan:** +92 321 444 3901

## License

MIT License - feel free to use this project for learning and development purposes. 