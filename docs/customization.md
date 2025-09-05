# Customization Guide

This guide shows you how to customize and extend the LangChain Chat Agent to suit your specific needs. From changing the knowledge base to adding new features, you'll learn how to make this project your own.

## 🎯 Customization Overview

The LangChain Chat Agent is designed to be highly customizable. You can modify:

- **Knowledge Base**: Change the documents the AI uses
- **AI Model**: Switch to different OpenAI models
- **Interface**: Customize the UI and user experience
- **Functionality**: Add new features and capabilities
- **Performance**: Optimize for your use case

## 📚 Changing the Knowledge Base

### 1. Replace the Sample Document

**Step 1: Prepare Your Document**
```bash
# Replace the existing document
cp your_document.txt sample_document.txt

# Or create a new document
echo "Your custom content here..." > sample_document.txt
```

**Step 2: Update Document References**
```javascript
// In index.js and web-server.js, change:
const documentText = readFileSync("sample_document.txt", "utf-8");

// To:
const documentText = readFileSync("your_document.txt", "utf-8");
```

### 2. Multiple Document Support

**Create a Document Loader:**
```javascript
// Add to index.js
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

async function loadMultipleDocuments() {
  const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
  });
  
  const docs = await loader.load();
  return docs;
}

// Replace document loading in initialize()
const docs = await loadMultipleDocuments();
```

**Directory Structure:**
```
lang-chain-agent/
├── documents/
│   ├── ai_basics.txt
│   ├── machine_learning.txt
│   ├── deep_learning.txt
│   └── ethics.txt
```

### 3. Different Document Formats

**PDF Support:**
```javascript
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new PDFLoader("document.pdf");
const docs = await loader.load();
```

**Web Page Support:**
```javascript
import { WebBrowser } from "langchain/tools/webbrowser";

const browser = new WebBrowser({ model, embeddings });
const docs = await browser.call("https://example.com");
```

## 🤖 Customizing the AI Model

### 1. Change OpenAI Model

**Different GPT Models:**
```javascript
// In index.js and web-server.js
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-4",           // More capable, slower
  // modelName: "gpt-3.5-turbo", // Faster, cost-effective
  // modelName: "gpt-4-turbo",   // Latest GPT-4
  temperature: 0.7,
});
```

**Model Comparison:**
| Model | Speed | Cost | Capability | Use Case |
|-------|-------|------|------------|----------|
| `gpt-3.5-turbo` | Fast | Low | Good | General use |
| `gpt-4` | Slow | High | Excellent | Complex reasoning |
| `gpt-4-turbo` | Medium | Medium | Excellent | Latest features |

### 2. Adjust Model Parameters

**Temperature (Creativity):**
```javascript
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",
  temperature: 0.1,  // More factual (0.0-1.0)
  // temperature: 0.7,  // Balanced
  // temperature: 0.9,  // More creative
});
```

### 3. Use Ollama (Local)

Run fully locally using Ollama for both generation and embeddings:

```javascript
// index.js and web-server.js automatically switch based on env
// .env
// LLM_PROVIDER=ollama
// OLLAMA_BASE_URL=http://localhost:11434
// OLLAMA_MODEL=llama3.1
// OLLAMA_EMBED_MODEL=nomic-embed-text

// Under the hood (for reference):
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const model = new ChatOllama({ baseUrl, model: "llama3.1", temperature: 0.7 });
const embeddings = new OllamaEmbeddings({ baseUrl, model: "nomic-embed-text" });
```

Make sure to pull the models first:

```bash
ollama pull llama3.1
ollama pull nomic-embed-text
```

**Max Tokens:**
```javascript
const model = new ChatOpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",
  maxTokens: 500,    // Shorter responses
  // maxTokens: 1000, // Default
  // maxTokens: 2000, // Longer responses
});
```

### 4. Use Different AI Providers

**Anthropic Claude:**
```javascript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  anthropicApiKey: "your_anthropic_key",
  modelName: "claude-3-sonnet-20240229",
});
```

**Google Gemini:**
```javascript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  apiKey: "your_google_api_key",
  modelName: "gemini-pro",
});
```

## 🔧 Customizing Document Processing

### 1. Adjust Chunking Strategy

**Different Chunk Sizes:**
```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,     // Smaller chunks for precision
  // chunkSize: 1000,  // Default
  // chunkSize: 2000,  // Larger chunks for context
  chunkOverlap: 100,  // Adjust overlap accordingly
});
```

**Custom Separators:**
```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: [
    "\n\n",    // Paragraphs
    "\n",      // Lines
    ". ",      // Sentences
    " ",       // Words
    ""         // Characters
  ],
});
```

### 2. Advanced Text Splitting

**Markdown-Aware Splitting:**
```javascript
import { MarkdownTextSplitter } from "langchain/text_splitter";

const textSplitter = new MarkdownTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
```

**Code-Aware Splitting:**
```javascript
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: [
    "\n\n", "\n", " ", ""
  ],
  keepSeparator: true,
});
```

### 3. Custom Embeddings

**Different Embedding Models:**
```javascript
// OpenAI embeddings (default)
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: openaiApiKey,
  modelName: "text-embedding-ada-002",
});

// Cohere embeddings
import { CohereEmbeddings } from "@langchain/cohere";
const embeddings = new CohereEmbeddings({
  apiKey: "your_cohere_key",
  model: "embed-english-v3.0",
});

// HuggingFace embeddings
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "sentence-transformers/all-MiniLM-L6-v2",
});
```

## 🎨 Customizing the Interface

### 1. Web Interface Customization

**Change Colors and Styling:**
```css
/* In public/index.html, modify the CSS */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: #f8f9fa;
  --text-color: #333;
}

.chat-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}
```

**Add Custom Features:**
```javascript
// Add file upload functionality
function addFileUpload() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,.pdf,.docx';
  fileInput.onchange = handleFileUpload;
  document.querySelector('.chat-header').appendChild(fileInput);
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
}
```

### 2. CLI Interface Customization

**Custom Welcome Message:**
```javascript
// In index.js
console.log("🚀 Welcome to Your Custom AI Assistant!");
console.log("📚 Knowledge Base: Your Custom Domain");
console.log("💡 Type 'help' for commands, 'quit' to exit");
```

**Add New Commands:**
```javascript
// Add to the command handling section
} else if (input.toLowerCase() === "stats") {
  console.log(`📊 Chat Statistics:`);
  console.log(`- Total messages: ${agent.chatHistory.length}`);
  console.log(`- User messages: ${agent.chatHistory.filter(m => m.role === "user").length}`);
  console.log(`- AI responses: ${agent.chatHistory.filter(m => m.role === "assistant").length}`);
  askQuestion();
} else if (input.toLowerCase() === "export") {
  const chatLog = agent.chatHistory.map(msg => 
    `${msg.role}: ${msg.content}`
  ).join('\n\n');
  console.log("💾 Chat exported to chat_log.txt");
  writeFileSync("chat_log.txt", chatLog);
  askQuestion();
```

## 🔄 Adding New Features

### 1. File Upload Support

**Backend Implementation:**
```javascript
// Add to web-server.js
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // Process the uploaded file
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.createDocuments([fileContent]);
    
    // Add to existing vector store
    await chatAgent.vectorStore.addDocuments(docs);
    
    res.json({ message: 'File uploaded and processed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
```

**Frontend Implementation:**
```html
<!-- Add to public/index.html -->
<div class="file-upload">
  <input type="file" id="fileInput" accept=".txt,.pdf,.docx" />
  <button onclick="uploadFile()">Upload Document</button>
</div>

<script>
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) return;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    addMessage(`📄 ${result.message}`, 'system');
  } catch (error) {
    addMessage('❌ Upload failed', 'system');
  }
}
</script>
```

### 2. Conversation Export

**Export to Different Formats:**
```javascript
// Add to index.js
function exportConversation(format = 'txt') {
  const chatHistory = agent.getChatHistory();
  
  switch (format) {
    case 'txt':
      const txtContent = chatHistory.map(msg => 
        `${msg.role.toUpperCase()}: ${msg.content}`
      ).join('\n\n');
      writeFileSync(`chat_export_${Date.now()}.txt`, txtContent);
      break;
      
    case 'json':
      const jsonContent = JSON.stringify(chatHistory, null, 2);
      writeFileSync(`chat_export_${Date.now()}.json`, jsonContent);
      break;
      
    case 'csv':
      const csvContent = chatHistory.map(msg => 
        `"${msg.role}","${msg.content.replace(/"/g, '""')}"`
      ).join('\n');
      writeFileSync(`chat_export_${Date.now()}.csv`, csvContent);
      break;
  }
}
```

### 3. Advanced Retrieval

**Hybrid Search:**
```javascript
import { HybridRetriever } from "langchain/retrievers/hybrid";

// Combine semantic and keyword search
const semanticRetriever = vectorStore.asRetriever({ k: 2 });
const keywordRetriever = new BM25Retriever(docs);

const hybridRetriever = new HybridRetriever([
  semanticRetriever,
  keywordRetriever
]);
```

**Re-ranking:**
```javascript
import { CohereRerank } from "@langchain/cohere";

const reranker = new CohereRerank({
  apiKey: "your_cohere_key",
  model: "rerank-english-v2.0",
  topN: 3
});

// Use in retrieval chain
const retrievedDocs = await retriever.getRelevantDocuments(query);
const rerankedDocs = await reranker.rerank(retrievedDocs, query);
```

## ⚡ Performance Optimization

### 1. Caching

**Response Caching:**
```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

async function getCachedResponse(query) {
  const cacheKey = `response:${query}`;
  let response = cache.get(cacheKey);
  
  if (!response) {
    response = await agent.chat(query);
    cache.set(cacheKey, response);
  }
  
  return response;
}
```

**Embedding Caching:**
```javascript
// Cache embeddings to avoid recomputing
const embeddingCache = new Map();

async function getCachedEmbedding(text) {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text);
  }
  
  const embedding = await embeddings.embedQuery(text);
  embeddingCache.set(text, embedding);
  return embedding;
}
```

### 2. Vector Store Optimization

**Use Production Vector Stores:**
```javascript
// Pinecone (cloud-based)
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: "your_pinecone_key",
});

const vectorStore = await PineconeStore.fromDocuments(
  docs,
  embeddings,
  {
    pineconeIndex: pinecone.Index("your-index"),
  }
);

// Weaviate (self-hosted)
import { WeaviateStore } from "@langchain/weaviate";
import weaviate from "weaviate-ts-client";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const vectorStore = await WeaviateStore.fromDocuments(
  docs,
  embeddings,
  {
    client,
    indexName: "YourClass",
  }
);
```

### 3. Batch Processing

**Process Multiple Queries:**
```javascript
async function batchProcess(queries) {
  const results = [];
  
  for (const query of queries) {
    const result = await agent.chat(query);
    results.push({ query, result });
  }
  
  return results;
}

// Usage
const queries = [
  "What is AI?",
  "What is machine learning?",
  "What is deep learning?"
];

const results = await batchProcess(queries);
```

## 🔒 Security Enhancements

### 1. Input Validation

**Sanitize User Input:**
```javascript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input) {
  return DOMPurify.sanitize(input.trim());
}

// Use in chat function
const sanitizedInput = sanitizeInput(userInput);
```

### 2. Rate Limiting

**Add Rate Limiting:**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/chat', limiter);
```

### 3. API Key Security

**Environment Variable Validation:**
```javascript
function validateEnvironment() {
  const required = ['OPENAI_API_KEY'];
  
  for (const var_name of required) {
    if (!process.env[var_name]) {
      throw new Error(`Missing required environment variable: ${var_name}`);
    }
  }
}

// Call at startup
validateEnvironment();
```

## 📊 Monitoring and Analytics

### 1. Response Analytics

**Track Response Quality:**
```javascript
class ChatAnalytics {
  constructor() {
    this.metrics = {
      totalQueries: 0,
      averageResponseTime: 0,
      errorRate: 0,
      popularQueries: new Map()
    };
  }
  
  trackQuery(query, response, responseTime, error = null) {
    this.metrics.totalQueries++;
    
    // Track popular queries
    const count = this.metrics.popularQueries.get(query) || 0;
    this.metrics.popularQueries.set(query, count + 1);
    
    // Track response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime + responseTime) / 2;
    
    // Track errors
    if (error) {
      this.metrics.errorRate = 
        (this.metrics.errorRate * (this.metrics.totalQueries - 1) + 1) / 
        this.metrics.totalQueries;
    }
  }
  
  getReport() {
    return {
      ...this.metrics,
      popularQueries: Array.from(this.metrics.popularQueries.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  }
}
```

### 2. Usage Dashboard

**Add Analytics Endpoint:**
```javascript
// Add to web-server.js
app.get('/api/analytics', (req, res) => {
  const analytics = chatAgent.getAnalytics();
  res.json(analytics);
});
```

## 🎯 Best Practices

### 1. **Modular Design**
- Keep customizations in separate files
- Use configuration files for settings
- Implement feature flags for easy toggling

### 2. **Error Handling**
- Always wrap custom code in try-catch blocks
- Provide meaningful error messages
- Log errors for debugging

### 3. **Testing**
- Test customizations thoroughly
- Use unit tests for new features
- Validate performance impact

### 4. **Documentation**
- Document all customizations
- Keep configuration examples
- Update README with new features

---

**Next Steps**: Explore [Performance Optimization](./performance.md) for advanced tuning, or check out [Troubleshooting](./troubleshooting.md) for help with customizations.
