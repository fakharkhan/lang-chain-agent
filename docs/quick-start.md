# Quick Start Guide

Get the LangChain Chat Agent up and running in under 5 minutes! This guide provides the fastest path to start chatting with your AI assistant.

## ⚡ 5-Minute Setup

### Step 1: Prerequisites (1 minute)

**Install Node.js:**
- Download from [nodejs.org](https://nodejs.org/)
- Choose version 18 or higher
- Verify: `node --version`

**Get OpenAI API Key:**
- Sign up at [platform.openai.com](https://platform.openai.com/)
- Create API key in account settings
- Copy the key (starts with `sk-`)

### Step 2: Download & Install (1 minute)

```bash
# Navigate to project directory
cd lang-chain-agent

# Install dependencies
npm install
```

### Step 3: Configure API Key (1 minute)

```bash
# Set your API key
export OPENAI_API_KEY=your_api_key_here

# Or create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

### Step 4: Start the Application (1 minute)

```bash
# Web interface (recommended)
npm run web

# Or command line interface
npm start
```

### Step 5: Start Chatting! (1 minute)

1. **Web Interface**: Open browser to `http://localhost:3000`
2. **CLI**: Type your questions in the terminal

**Try these questions:**
- "What is artificial intelligence?"
- "What are the types of machine learning?"
- "How is AI used in healthcare?"

## 🎯 First Chat Example

```
You: What is artificial intelligence?
🤖 Assistant: Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.

You: What are the three types of machine learning?
🤖 Assistant: Based on the context, the three main types of machine learning are:

1. Supervised Learning
2. Unsupervised Learning  
3. Reinforcement Learning

These are the primary categories of machine learning algorithms that enable computers to learn and improve their performance through different approaches to data processing and pattern recognition.
```

## 🚀 Available Commands

### Web Interface
- **Type questions**: Just type and press Enter
- **Clear chat**: Click "Clear Chat" button
- **Responsive design**: Works on mobile and desktop

### Command Line Interface
- **`help`**: Show available commands
- **`clear`**: Clear chat history
- **`quit`**: Exit the application

## 🔧 Quick Customization

### Change the Knowledge Base
```bash
# Replace the sample document
cp your_document.txt sample_document.txt
```

### Adjust Response Style
```javascript
// In index.js, modify temperature
temperature: 0.3,  // More factual (0.0-1.0)
```

### Use Different Model
```javascript
// In index.js, change model
modelName: "gpt-4",  // More capable but slower
```

## 🎨 Interface Options

### Web Interface (Recommended)
- **Modern UI**: Beautiful, responsive design
- **Real-time typing**: See when AI is thinking
- **Easy to use**: No terminal knowledge required
- **Mobile friendly**: Works on phones and tablets

### Command Line Interface
- **Lightweight**: Fast and efficient
- **No browser needed**: Works in any terminal
- **Development friendly**: Perfect for testing
- **Scriptable**: Can be automated

## 📊 Performance Tips

### For Faster Responses
```javascript
// Reduce chunk size
chunkSize: 500,  // Instead of 1000

// Lower temperature
temperature: 0.3,  // Instead of 0.7

// Fewer retrieved documents
k: 2,  // Instead of 3
```

### For Better Quality
```javascript
// Use GPT-4
modelName: "gpt-4",

// Higher temperature for creativity
temperature: 0.8,

// More context
k: 5,  // More documents
```

## 🔍 Troubleshooting Quick Fixes

### "OpenAI API key is required"
```bash
export OPENAI_API_KEY=your_key_here
```

### "Module not found"
```bash
npm install
```

### "Port 3000 is already in use"
```bash
PORT=3001 npm run web
```

### Slow responses
```bash
# Clear chat history
clear

# Or restart
quit
npm start
```

## 📚 What's Next?

### Learn More
- **[Overview](./overview.md)**: Understand how the project works
- **[RAG Architecture](./rag-architecture.md)**: Learn about the technology
- **[Customization](./customization.md)**: Make it your own

### Advanced Features
- **Multiple documents**: Load several knowledge bases
- **File upload**: Add documents through the web interface
- **Custom prompts**: Modify how the AI responds
- **Production deployment**: Deploy to cloud services

### Example Use Cases
- **Educational assistant**: Answer questions about course materials
- **Knowledge base chatbot**: Handle customer support queries
- **Research assistant**: Help with literature reviews
- **Document Q&A**: Ask questions about your documents

## 🎯 Success Checklist

Before moving to advanced topics, ensure you can:

- [ ] Start the application successfully
- [ ] Ask questions and receive answers
- [ ] Use both web and CLI interfaces
- [ ] Clear chat history
- [ ] Understand basic commands
- [ ] Customize the knowledge base

## 💡 Pro Tips

### 1. **Start Simple**
- Begin with the default settings
- Test with simple questions
- Gradually add complexity

### 2. **Monitor Usage**
- Check OpenAI dashboard for costs
- Set up billing alerts
- Monitor response quality

### 3. **Iterate Quickly**
- Make small changes
- Test immediately
- Keep what works

### 4. **Document Everything**
- Note successful configurations
- Record useful questions
- Share insights with team

## 🚨 Common Pitfalls

### 1. **API Key Issues**
- Don't commit API keys to version control
- Use environment variables
- Check key validity regularly

### 2. **Performance Problems**
- Start with smaller documents
- Use appropriate chunk sizes
- Monitor memory usage

### 3. **Quality Issues**
- Clean your documents before use
- Test with various question types
- Adjust parameters based on results

## 📞 Getting Help

### Quick Resources
- **This guide**: Covers most common issues
- **Troubleshooting guide**: Detailed problem-solving
- **Customization guide**: Advanced modifications

### When to Ask for Help
- Setup takes longer than 5 minutes
- Error messages aren't clear
- Performance is unacceptable
- Need help with custom features

---

**Ready to dive deeper?** Check out the [Overview](./overview.md) to understand the technology, or explore [Customization](./customization.md) to make the project your own!
