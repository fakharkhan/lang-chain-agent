import express from 'express';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { readFileSync } from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize chat agent
class WebChatAgent {
  constructor() {
    this.vectorStore = null;
    this.retriever = null;
    this.chain = null;
    this.chatHistory = [];
  }

  async initialize(options = {}) {
    try {
      const provider = (options.provider || process.env.LLM_PROVIDER || "openai").toLowerCase();

      // Initialize the chat model and embeddings
      let model;
      let embeddings;

      if (provider === "ollama") {
        const { ChatOllama } = await import("@langchain/community/chat_models/ollama");
        const { OllamaEmbeddings } = await import("@langchain/community/embeddings/ollama");
        const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
        const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1";
        const embedModel = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
        model = new ChatOllama({ baseUrl, model: ollamaModel, temperature: 0.7 });
        embeddings = new OllamaEmbeddings({ baseUrl, model: embedModel });
        console.log(`Using Ollama model: ${ollamaModel} (embeddings: ${embedModel})`);
      } else {
        const openaiApiKey = options.openaiApiKey || process.env.OPENAI_API_KEY;
        model = new ChatOpenAI({
          openAIApiKey: openaiApiKey,
          modelName: "gpt-3.5-turbo",
          temperature: 0.7,
        });
        embeddings = new OpenAIEmbeddings({ openAIApiKey: openaiApiKey });
        console.log("Using OpenAI provider: gpt-3.5-turbo + text-embedding-3-small (default)");
      }

      // Load and process the sample document
      console.log("Loading and processing the sample document...");
      const documentText = readFileSync("sample_document.txt", "utf-8");
      
      // Split the document into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      
      const docs = await textSplitter.createDocuments([documentText]);

      // Create vector store with embeddings
      this.vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

      // Create retriever
      this.retriever = this.vectorStore.asRetriever({
        k: 3,
      });

      // Create the RAG chain
      const prompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context. 
Use the following context to answer the user's question. If the context doesn't contain enough information to answer the question, say so.

Context:
{context}

Chat History:
{chat_history}

User Question: {question}

Answer: `);

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

      console.log("✅ Web chat agent initialized successfully!");
      return true;
    } catch (error) {
      console.error("❌ Error initializing web chat agent:", error.message);
      return false;
    }
  }

  async chat(userInput) {
    try {
      // Add user input to chat history
      this.chatHistory.push({ role: "user", content: userInput });

      // Get response from the chain
      const response = await this.chain.invoke({
        question: userInput,
        chat_history: this.chatHistory
          .slice(-6)
          .map(msg => `${msg.role}: ${msg.content}`)
          .join("\n"),
      });

      // Add assistant response to chat history
      this.chatHistory.push({ role: "assistant", content: response });

      return response;
    } catch (error) {
      console.error("❌ Error in chat:", error.message);
      return "I apologize, but I encountered an error while processing your request. Please try again.";
    }
  }

  clearChatHistory() {
    this.chatHistory = [];
    return "Chat history cleared!";
  }
}

// Initialize the chat agent
const chatAgent = new WebChatAgent();
const provider = (process.env.LLM_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : "ollama")).toLowerCase();
const openaiApiKey = process.env.OPENAI_API_KEY;

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.json({ error: 'Message is required' });
    }

    const response = await chatAgent.chat(message.trim());
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clear', (req, res) => {
  try {
    const message = chatAgent.clearChatHistory();
    res.json({ message });
  } catch (error) {
    console.error('Clear error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  console.log("🤖 Initializing Web Chat Agent...");
  
  if (provider === "openai" && !openaiApiKey) {
    console.error("❌ OPENAI_API_KEY environment variable is required for provider=openai");
    console.log("Please set your OpenAI API key as an environment variable:");
    console.log("export OPENAI_API_KEY=your_api_key_here");
    process.exit(1);
  }
  
  const initialized = await chatAgent.initialize({ provider, openaiApiKey });
  if (!initialized) {
    console.error("❌ Failed to initialize chat agent");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Web chat agent is running on http://localhost:${PORT}`);
    console.log(`📱 Open your browser and navigate to the URL above`);
  });
}

startServer().catch(console.error); 
