# RAG Architecture

This document explains the **Retrieval Augmented Generation (RAG)** architecture used in the LangChain Chat Agent project. Understanding RAG is crucial for building intelligent AI applications that can provide accurate, contextual responses.

## What is RAG?

**Retrieval Augmented Generation (RAG)** is a technique that combines the power of large language models with external knowledge retrieval. Instead of relying solely on pre-trained knowledge, RAG systems:

1. **Retrieve** relevant information from external sources
2. **Augment** the AI model's knowledge with this information
3. **Generate** responses based on the retrieved context

## 🏗️ RAG Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        RAG System                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Document  │    │   Document  │    │   Document  │         │
│  │   Store     │    │  Processing │    │  Embeddings │         │
│  │             │    │             │    │             │         │
│  │ • Text      │───▶│ • Chunking  │───▶│ • Vector    │         │
│  │ • PDFs      │    │ • Cleaning  │    │ • Database  │         │
│  │ • Web pages │    │ • Metadata  │    │ • Indexing  │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Query Processing Pipeline                  │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │   │
│  │  │   User      │    │   Query     │    │   Vector    │ │   │
│  │  │   Query     │───▶│  Embedding  │───▶│  Similarity │ │   │
│  │  │             │    │             │    │   Search    │ │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Generation Pipeline                        │   │
│  │                                                         │   │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │   │
│  │  │ Retrieved   │    │   Prompt    │    │   LLM       │ │   │
│  │  │ Documents   │───▶│  Template   │───▶│  Generation │ │   │
│  │  │             │    │             │    │             │ │   │
│  │  └─────────────┘    └─────────────┘    └─────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 RAG Process Flow

### Phase 1: Document Ingestion

#### 1.1 Document Loading
```javascript
// Load the document from file system
const documentText = readFileSync("sample_document.txt", "utf-8");
```

**What happens:**
- Raw text is loaded from the source
- Text is cleaned and normalized
- Metadata is extracted (if available)

#### 1.2 Document Chunking
```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,      // Maximum characters per chunk
  chunkOverlap: 200,    // Overlap between chunks
});

const docs = await textSplitter.createDocuments([documentText]);
```

**Why chunking is important:**
- **Token Limits**: LLMs have maximum input lengths
- **Precision**: Smaller chunks allow more targeted retrieval
- **Context**: Overlap maintains context between chunks

**Chunking Strategy:**
```
Original Document: "Artificial Intelligence (AI) is a branch of computer science..."

Chunk 1: "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding."

Chunk 2: "Machine Learning is a subset of AI that focuses on the development of algorithms and statistical models that enable computers to improve their performance on a specific task through experience. There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning."

Chunk 3: "Deep Learning is a subset of machine learning that uses artificial neural networks with multiple layers (hence "deep") to model and understand complex patterns in data..."
```

#### 1.3 Vector Embedding
```javascript
this.vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings({ openAIApiKey: openaiApiKey })
);
```

**What happens:**
- Each text chunk is converted to a high-dimensional vector
- Vectors capture semantic meaning, not just words
- Similar concepts have similar vectors

**Vector Example:**
```
Text: "Machine Learning is a subset of AI"
Vector: [0.23, -0.45, 0.67, -0.12, 0.89, ...] (1536 dimensions)
```

### Phase 2: Query Processing

#### 2.1 User Query Reception
```javascript
async chat(userInput) {
  // Add user input to chat history
  this.chatHistory.push({ role: "user", content: userInput });
  
  // Process the query
  const response = await this.chain.invoke({
    question: userInput,
    chat_history: this.chatHistory
  });
}
```

#### 2.2 Query Embedding
The user's question is converted to the same vector space as the documents:

```javascript
// This happens internally in the retriever
const queryEmbedding = await embeddings.embedQuery(userInput);
// Result: [0.34, -0.23, 0.56, -0.78, 0.12, ...]
```

#### 2.3 Similarity Search
```javascript
this.retriever = this.vectorStore.asRetriever({
  k: 3, // Number of documents to retrieve
});

const docs = await this.retriever.getRelevantDocuments(input.question);
```

**Similarity Calculation:**
- Cosine similarity between query vector and document vectors
- Top-k most similar documents are retrieved
- Similarity scores determine relevance

### Phase 3: Response Generation

#### 3.1 Context Assembly
```javascript
const prompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context. 
Use the following context to answer the user's question. If the context doesn't contain enough information to answer the question, say so.

Context:
{context}

Chat History:
{chat_history}

User Question: {question}

Answer: `);
```

**Context Format:**
```
Context:
Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.

Machine Learning is a subset of AI that focuses on the development of algorithms and statistical models that enable computers to improve their performance on a specific task through experience. There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.

Chat History:
user: What is machine learning?
assistant: Machine Learning is a subset of AI that focuses on developing algorithms and statistical models that enable computers to improve their performance on specific tasks through experience.

User Question: What are the types of machine learning?
```

#### 3.2 LLM Generation
```javascript
this.chain = RunnableSequence.from([
  {
    context: async (input) => {
      const docs = await this.retriever.getRelevantDocuments(input.question);
      return docs.map(doc => doc.pageContent).join("\n\n");
    },
    question: (input) => input.question,
    chat_history: (input) => input.chat_history,
  },
  prompt,
  model,
  new StringOutputParser(),
]);
```

**What the LLM receives:**
- **Context**: Retrieved relevant documents
- **Question**: User's original query
- **History**: Previous conversation for continuity
- **Instructions**: How to format the response

## 🎯 RAG Components in Detail

### 1. Document Store
```javascript
// In-memory vector store (for development)
const vectorStore = new MemoryVectorStore(embeddings);

// Production alternatives:
// - Pinecone: Scalable cloud vector database
// - Weaviate: Open-source vector database
// - Chroma: Local vector database
```

### 2. Embeddings Model
```javascript
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: openaiApiKey,
  modelName: "text-embedding-ada-002" // Default model
});
```

**Embedding Models:**
- **OpenAI text-embedding-ada-002**: 1536 dimensions, high quality
- **OpenAI text-embedding-3-small**: 1536 dimensions, faster
- **OpenAI text-embedding-3-large**: 3072 dimensions, highest quality

### 3. Retrieval Strategy
```javascript
// Basic retrieval
const retriever = vectorStore.asRetriever({
  k: 3, // Number of documents to retrieve
});

// Advanced retrieval with filters
const retriever = vectorStore.asRetriever({
  k: 5,
  filter: { category: "machine-learning" },
  searchType: "similarity", // or "mmr" for diversity
});
```

### 4. Prompt Engineering
```javascript
const prompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context. 
Use the following context to answer the user's question. If the context doesn't contain enough information to answer the question, say so.

Context:
{context}

Chat History:
{chat_history}

User Question: {question}

Answer: `);
```

**Prompt Components:**
- **System Message**: Defines the assistant's role
- **Context**: Retrieved relevant documents
- **History**: Previous conversation
- **Question**: Current user query
- **Instructions**: Response format and constraints

## 🔧 RAG Configuration Options

### Chunking Parameters
```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,        // Characters per chunk
  chunkOverlap: 200,      // Overlap between chunks
  separators: ["\n\n", "\n", " ", ""], // Splitting strategy
});
```

### Retrieval Parameters
```javascript
const retriever = vectorStore.asRetriever({
  k: 3,                   // Number of documents
  searchType: "similarity", // Similarity or MMR
  scoreThreshold: 0.7,    // Minimum similarity score
});
```

### Model Parameters
```javascript
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,       // Creativity (0.0-1.0)
  maxTokens: 1000,        // Maximum response length
});
```

## 📊 RAG vs Traditional Approaches

| Aspect | Traditional Chatbot | RAG System |
|--------|-------------------|------------|
| **Knowledge Source** | Pre-trained data | Dynamic documents |
| **Accuracy** | Generic responses | Document-specific |
| **Updating** | Retraining required | Update documents |
| **Customization** | Limited | Highly flexible |
| **Context** | Basic | Rich, relevant |
| **Cost** | High training cost | Low operational cost |

## 🚀 Advanced RAG Techniques

### 1. Hybrid Search
```javascript
// Combine semantic and keyword search
const hybridRetriever = new HybridRetriever([
  vectorStore.asRetriever({ k: 2 }),
  keywordRetriever
]);
```

### 2. Re-ranking
```javascript
// Re-rank retrieved documents for better relevance
const reranker = new CohereRerank({
  model: "rerank-english-v2.0",
  topN: 3
});
```

### 3. Multi-hop Retrieval
```javascript
// Iterative retrieval for complex questions
const multiHopRetriever = new MultiQueryRetriever({
  retriever: vectorStore.asRetriever(),
  llmChain: new LLMChain({ llm, prompt }),
  parserKey: "text",
  retrieverChain: new StuffDocumentsChain({ llmChain, documentVariableName: "context" })
});
```

## 🔍 Monitoring and Evaluation

### Retrieval Metrics
- **Precision**: How many retrieved documents are relevant
- **Recall**: How many relevant documents were retrieved
- **F1 Score**: Balance between precision and recall

### Generation Metrics
- **Relevance**: How well the response answers the question
- **Accuracy**: How factually correct the response is
- **Fluency**: How natural the response sounds

## 🎯 Best Practices

### Document Processing
1. **Clean your documents** before chunking
2. **Use appropriate chunk sizes** for your use case
3. **Maintain context** with chunk overlap
4. **Add metadata** for better filtering

### Retrieval
1. **Tune the number of documents** (k) based on your needs
2. **Use similarity thresholds** to filter low-quality matches
3. **Consider hybrid search** for better results
4. **Implement re-ranking** for complex queries

### Generation
1. **Write clear prompts** that specify the assistant's role
2. **Include context limitations** in your prompts
3. **Use conversation history** for continuity
4. **Set appropriate temperature** for your use case

---

**Next Steps**: Learn about [Vector Embeddings](./vector-embeddings.md) to understand how document processing works in detail.
