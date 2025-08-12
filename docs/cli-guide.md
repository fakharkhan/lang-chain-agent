# Command Line Interface Guide

This guide explains how to use the command-line interface (CLI) version of the LangChain Chat Agent. The CLI provides a lightweight, fast way to interact with the AI assistant directly from your terminal.

## 🚀 Starting the CLI

### Basic Start
```bash
npm start
```

### Development Mode (Auto-restart)
```bash
npm run dev
```

**Expected Output:**
```
🤖 Welcome to the LangChain Chat Agent!
=====================================
Loading and processing the sample document...
✅ Chat agent initialized successfully!

💬 Chat Agent is ready! You can now ask questions about AI.
Type 'quit' to exit, 'clear' to clear chat history, or 'help' for commands.

You: 
```

## 🎯 Available Commands

### Chat Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show available commands | `help` |
| `clear` | Clear chat history | `clear` |
| `quit` or `exit` | Exit the application | `quit` |

### Example Questions

You can ask questions about AI topics covered in the sample document:

```
You: What is artificial intelligence?
You: What are the different types of machine learning?
You: How is AI used in healthcare?
You: What are the ethical concerns with AI?
You: When was the term AI first coined?
```

## 💬 Chat Interface Features

### 1. **Interactive Chat**
- Type your questions and press Enter
- The AI will respond based on the sample document
- Conversation history is maintained for context

### 2. **Real-time Processing**
- See "🤖 Assistant: Thinking..." while the AI processes
- Responses are generated using RAG (Retrieval Augmented Generation)
- Context from previous messages is considered

### 3. **Memory Management**
- Chat history is automatically maintained
- Previous context helps with follow-up questions
- Use `clear` to reset the conversation

## 📝 Usage Examples

### Basic Question and Answer
```
You: What is machine learning?
🤖 Assistant: Machine Learning is a subset of AI that focuses on the development of algorithms and statistical models that enable computers to improve their performance on a specific task through experience. There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.
```

### Follow-up Questions
```
You: What is machine learning?
🤖 Assistant: Machine Learning is a subset of AI that focuses on the development of algorithms and statistical models that enable computers to improve their performance on a specific task through experience. There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.

You: What are the three types?
🤖 Assistant: Based on the context, the three main types of machine learning are:

1. Supervised Learning
2. Unsupervised Learning  
3. Reinforcement Learning

These are the primary categories of machine learning algorithms that enable computers to learn and improve their performance through different approaches to data processing and pattern recognition.
```

### Using Commands
```
You: help
Available commands:
- 'quit' or 'exit': Exit the application
- 'clear': Clear chat history
- 'help': Show this help message
- Any other text: Ask a question about AI

You: clear
Chat history cleared!

You: quit
👋 Goodbye!
```

## 🔧 Configuration Options

### Environment Variables

You can customize the CLI behavior using environment variables:

```bash
# Set OpenAI API key
export OPENAI_API_KEY=your_api_key_here

# Set custom model (optional)
export OPENAI_MODEL=gpt-4

# Set temperature (optional)
export OPENAI_TEMPERATURE=0.7
```

### Runtime Configuration

The CLI uses these default settings (configurable in `index.js`):

```javascript
// Model settings
modelName: "gpt-3.5-turbo"
temperature: 0.7

// Document processing
chunkSize: 1000
chunkOverlap: 200

// Retrieval settings
k: 3  // Number of documents to retrieve
```

## 🎨 CLI Interface Design

### Visual Elements
- **Emojis**: Used for visual appeal and quick identification
- **Clear formatting**: Easy-to-read output with proper spacing
- **Status indicators**: Shows when the AI is thinking

### Color Coding (if supported)
- **User input**: Standard terminal color
- **AI responses**: Standard terminal color
- **System messages**: Standard terminal color
- **Error messages**: Standard terminal color

## 🔍 Troubleshooting CLI Issues

### Common Problems

#### 1. "OpenAI API key is required"
**Solution:**
```bash
# Set your API key
export OPENAI_API_KEY=your_api_key_here

# Or create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

#### 2. "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
npm install
```

#### 3. Slow responses
**Possible causes:**
- Large document chunks
- High temperature setting
- Network latency
- OpenAI API rate limits

**Solutions:**
```javascript
// Reduce chunk size in index.js
chunkSize: 500

// Lower temperature for faster responses
temperature: 0.3

// Reduce number of retrieved documents
k: 2
```

#### 4. Memory issues
**Solution:**
```bash
# Clear chat history
clear

# Or restart the application
quit
npm start
```

## 📊 Performance Tips

### 1. **Optimize Chunk Size**
- Smaller chunks (500-800 chars) for precise answers
- Larger chunks (1000-1500 chars) for comprehensive responses

### 2. **Adjust Retrieval Count**
- Lower `k` (2-3) for focused answers
- Higher `k` (4-5) for comprehensive responses

### 3. **Temperature Settings**
- Lower temperature (0.1-0.3) for factual responses
- Higher temperature (0.7-0.9) for creative responses

### 4. **Model Selection**
- `gpt-3.5-turbo`: Fast, cost-effective
- `gpt-4`: More accurate, slower, more expensive

## 🔄 Advanced Usage

### Batch Processing
You can create a script to process multiple questions:

```bash
#!/bin/bash
# questions.txt contains one question per line
while IFS= read -r question; do
    echo "Question: $question"
    # Process question (would need to modify the code)
done < questions.txt
```

### Integration with Other Tools
```bash
# Pipe output to a file
npm start > chat_log.txt

# Use with grep to search responses
npm start | grep "machine learning"
```

### Custom Prompts
You can modify the prompt template in `index.js`:

```javascript
const prompt = PromptTemplate.fromTemplate(`
You are an expert AI assistant specializing in artificial intelligence.
Provide detailed, accurate answers based on the following context.

Context:
{context}

Chat History:
{chat_history}

User Question: {question}

Please provide a comprehensive answer: `);
```

## 🎯 Best Practices

### 1. **Question Formulation**
- Be specific and clear
- Use follow-up questions for complex topics
- Reference previous conversation when needed

### 2. **Session Management**
- Use `clear` when switching topics
- Restart the application for fresh sessions
- Monitor memory usage for long conversations

### 3. **Error Handling**
- Check API key validity
- Monitor OpenAI usage and costs
- Handle network interruptions gracefully

### 4. **Documentation**
- Keep track of useful questions and answers
- Document any custom configurations
- Share insights with team members

## 🔧 Customization Examples

### Custom Welcome Message
```javascript
console.log("🚀 AI Assistant v2.0 - Ready for intelligent conversations!");
console.log("📚 Knowledge base: Artificial Intelligence");
console.log("💡 Type 'help' for commands, 'quit' to exit");
```

### Custom Commands
```javascript
// Add new commands
if (input.toLowerCase() === "stats") {
  console.log(`📊 Chat Statistics:`);
  console.log(`- Messages: ${agent.chatHistory.length}`);
  console.log(`- User messages: ${agent.chatHistory.filter(m => m.role === "user").length}`);
  console.log(`- AI responses: ${agent.chatHistory.filter(m => m.role === "assistant").length}`);
  askQuestion();
}
```

### Enhanced Error Messages
```javascript
} catch (error) {
  console.error("❌ Error in chat:", error.message);
  console.log("💡 Try rephrasing your question or type 'clear' to reset");
  return "I apologize, but I encountered an error. Please try again.";
}
```

## 📈 Monitoring and Analytics

### Built-in Metrics
The CLI provides basic monitoring:
- Message count
- Response time
- Error tracking
- Memory usage

### Custom Analytics
You can add custom tracking:

```javascript
// Track response times
const startTime = Date.now();
const response = await agent.chat(input);
const responseTime = Date.now() - startTime;

console.log(`⏱️ Response time: ${responseTime}ms`);
```

---

**Next Steps**: Learn about the [Web Interface](./web-interface.md) for a more user-friendly experience, or explore [Customization](./customization.md) to modify the CLI behavior.
