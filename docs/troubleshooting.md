# Troubleshooting Guide

This guide helps you resolve common issues when using the LangChain Chat Agent. If you encounter problems, check this guide first before seeking additional help.

## 🚨 Common Issues

### 1. OpenAI API Key Issues

#### Problem: "OpenAI API key is required"
**Symptoms:**
- Application fails to start
- Error message about missing API key

**Solutions:**
```bash
# Method 1: Environment variable
export OPENAI_API_KEY=your_api_key_here

# Method 2: .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Method 3: Verify the key is set
echo $OPENAI_API_KEY
```

**Verification:**
```bash
# Test your API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### Problem: "Invalid API key"
**Symptoms:**
- API key is set but still getting errors
- Authentication failures

**Solutions:**
1. **Check key format**: Ensure it starts with `sk-`
2. **Verify in OpenAI dashboard**: Check if key is active
3. **Check credits**: Ensure you have sufficient balance
4. **Regenerate key**: Create a new API key if needed

### 2. Installation Issues

#### Problem: "Module not found" errors
**Symptoms:**
- `Cannot find module '@langchain/core'`
- Missing dependency errors

**Solutions:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18 or higher

# Update npm
npm install -g npm@latest
```

#### Problem: "Permission denied" errors
**Symptoms:**
- Cannot create directories
- Cannot write to files

**Solutions:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 3. Runtime Issues

#### Problem: "Port 3000 is already in use"
**Symptoms:**
- Web server fails to start
- Port conflict error

**Solutions:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run web
```

#### Problem: Slow response times
**Symptoms:**
- Long delays between question and answer
- Timeout errors

**Solutions:**
```javascript
// Reduce chunk size in index.js
chunkSize: 500,  // Instead of 1000

// Lower temperature for faster responses
temperature: 0.3,  // Instead of 0.7

// Reduce retrieved documents
k: 2,  // Instead of 3
```

#### Problem: Memory issues
**Symptoms:**
- Application becomes slow over time
- High memory usage
- Crashes after long conversations

**Solutions:**
```bash
# Clear chat history
clear

# Restart application
quit
npm start

# Monitor memory usage
top -p $(pgrep node)
```

### 4. Document Processing Issues

#### Problem: "Cannot read file"
**Symptoms:**
- Document loading fails
- File not found errors

**Solutions:**
```bash
# Check file exists
ls -la sample_document.txt

# Check file permissions
chmod 644 sample_document.txt

# Verify file encoding
file sample_document.txt
```

#### Problem: Poor retrieval quality
**Symptoms:**
- Irrelevant answers
- Missing context

**Solutions:**
```javascript
// Adjust chunk size
chunkSize: 800,  // Try different sizes

// Increase overlap
chunkOverlap: 300,  // More context between chunks

// Increase retrieved documents
k: 5,  // More documents for context
```

### 5. Network Issues

#### Problem: "Network timeout"
**Symptoms:**
- Requests fail after timeout
- Intermittent connection issues

**Solutions:**
```javascript
// Add timeout configuration
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",
  timeout: 30000,  // 30 seconds
  maxRetries: 3,
});
```

#### Problem: "Rate limit exceeded"
**Symptoms:**
- Too many requests error
- API quota exceeded

**Solutions:**
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/chat', limiter);
```

## 🔧 Debugging Techniques

### 1. Enable Debug Logging

**Add debug information:**
```javascript
// In index.js, add logging
console.log("🔍 Debug: Loading document...");
console.log("🔍 Debug: Document length:", documentText.length);
console.log("🔍 Debug: Number of chunks:", docs.length);
console.log("🔍 Debug: Vector store created");
```

### 2. Test Individual Components

**Test document loading:**
```javascript
// Test document loading separately
const documentText = readFileSync("sample_document.txt", "utf-8");
console.log("Document loaded:", documentText.substring(0, 100) + "...");
```

**Test embeddings:**
```javascript
// Test embedding generation
const testEmbedding = await embeddings.embedQuery("test");
console.log("Embedding generated:", testEmbedding.length, "dimensions");
```

**Test retrieval:**
```javascript
// Test document retrieval
const testDocs = await retriever.getRelevantDocuments("test question");
console.log("Retrieved documents:", testDocs.length);
```

### 3. Monitor API Usage

**Check OpenAI usage:**
```bash
# Check API usage (requires curl)
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/usage
```

**Monitor costs:**
- Check OpenAI dashboard for usage
- Set up billing alerts
- Monitor token usage

## 📊 Performance Optimization

### 1. Response Time Optimization

**Reduce chunk size:**
```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,  // Smaller chunks = faster processing
  chunkOverlap: 100,
});
```

**Use faster model:**
```javascript
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",  // Faster than gpt-4
  temperature: 0.3,  // Lower temperature = faster responses
});
```

**Optimize retrieval:**
```javascript
this.retriever = this.vectorStore.asRetriever({
  k: 2,  // Fewer documents = faster retrieval
  searchType: "similarity",  // Faster than MMR
});
```

### 2. Memory Optimization

**Limit chat history:**
```javascript
// Keep only last 10 messages
chat_history: this.chatHistory
  .slice(-10)  // Instead of -6
  .map(msg => `${msg.role}: ${msg.content}`)
  .join("\n"),
```

**Clear memory periodically:**
```javascript
// Auto-clear after 50 messages
if (this.chatHistory.length > 50) {
  this.chatHistory = this.chatHistory.slice(-20);
}
```

### 3. Cost Optimization

**Use cheaper models:**
```javascript
// Use gpt-3.5-turbo instead of gpt-4
modelName: "gpt-3.5-turbo",  // Much cheaper
```

**Limit response length:**
```javascript
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",
  maxTokens: 500,  // Limit response length
});
```

## 🐛 Common Error Messages

### OpenAI API Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid API key | Check API key format and validity |
| `429 Too Many Requests` | Rate limit exceeded | Wait or implement rate limiting |
| `500 Internal Server Error` | OpenAI service issue | Retry or check OpenAI status |
| `insufficient_quota` | No credits remaining | Add credits to OpenAI account |

### Node.js Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `ENOENT: no such file or directory` | Missing file | Check file path and permissions |
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `ENOMEM` | Out of memory | Restart application or optimize memory |
| `ECONNREFUSED` | Network connection failed | Check internet connection |

### LangChain Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Document not found` | Missing document file | Check file exists and is readable |
| `Embedding failed` | API call failed | Check API key and network |
| `Retrieval failed` | Vector store issue | Reinitialize vector store |
| `Chain execution failed` | Prompt or model issue | Check prompt template and model |

## 🔍 Diagnostic Tools

### 1. Health Check Script

**Create a diagnostic script:**
```javascript
// health-check.js
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { readFileSync } from "fs";

async function healthCheck() {
  console.log("🔍 Starting health check...");
  
  // Check environment
  console.log("✅ Environment variables:", {
    hasApiKey: !!process.env.OPENAI_API_KEY,
    nodeVersion: process.version,
  });
  
  // Test OpenAI connection
  try {
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
    });
    
    const response = await model.invoke("Hello");
    console.log("✅ OpenAI connection: OK");
  } catch (error) {
    console.log("❌ OpenAI connection failed:", error.message);
  }
  
  // Test embeddings
  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    
    const embedding = await embeddings.embedQuery("test");
    console.log("✅ Embeddings: OK");
  } catch (error) {
    console.log("❌ Embeddings failed:", error.message);
  }
  
  // Check document
  try {
    const documentText = readFileSync("sample_document.txt", "utf-8");
    console.log("✅ Document loading: OK");
    console.log("📄 Document size:", documentText.length, "characters");
  } catch (error) {
    console.log("❌ Document loading failed:", error.message);
  }
}

healthCheck();
```

**Run the health check:**
```bash
node health-check.js
```

### 2. Performance Monitoring

**Add performance tracking:**
```javascript
// Add to chat function
async chat(userInput) {
  const startTime = Date.now();
  
  try {
    const response = await this.chain.invoke({
      question: userInput,
      chat_history: this.chatHistory
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Response time: ${responseTime}ms`);
    
    return response;
  } catch (error) {
    const errorTime = Date.now() - startTime;
    console.log(`❌ Error after ${errorTime}ms:`, error.message);
    throw error;
  }
}
```

## 🆘 Getting Help

### 1. Before Asking for Help

**Check these resources:**
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [LangChain Documentation](https://js.langchain.com/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

**Gather information:**
- Error messages (full text)
- Node.js version: `node --version`
- npm version: `npm --version`
- Operating system
- Steps to reproduce the issue

### 2. Common Solutions

**Most issues can be resolved by:**
1. **Restarting the application**
2. **Checking API key validity**
3. **Clearing chat history**
4. **Reinstalling dependencies**
5. **Checking file permissions**

### 3. When to Seek Additional Help

**Contact support if:**
- Error persists after trying all solutions
- Issue is not covered in this guide
- You need help with custom modifications
- Performance issues affect production use

---

**Next Steps**: If you're still having issues, check the [Performance Optimization](./performance.md) guide for advanced tuning, or explore [Customization](./customization.md) for specific modifications.
