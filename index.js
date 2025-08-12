import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { readFileSync } from "fs";
import { createInterface } from "readline";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class ChatAgent {
  constructor() {
    this.vectorStore = null;
    this.retriever = null;
    this.chain = null;
    this.chatHistory = [];
  }

  async initialize(openaiApiKey) {
    try {
      // Initialize the chat model
      const model = new ChatOpenAI({
        openAIApiKey: openaiApiKey,
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
      });

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
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        new OpenAIEmbeddings({ openAIApiKey: openaiApiKey })
      );

      // Create retriever
      this.retriever = this.vectorStore.asRetriever({
        k: 3, // Number of documents to retrieve
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

      console.log("✅ Chat agent initialized successfully!");
      return true;
    } catch (error) {
      console.error("❌ Error initializing chat agent:", error.message);
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
          .slice(-6) // Keep last 6 messages for context
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

  getChatHistory() {
    return this.chatHistory;
  }

  clearChatHistory() {
    this.chatHistory = [];
    console.log("Chat history cleared!");
  }
}

// Main application
async function main() {
  console.log("🤖 Welcome to the LangChain Chat Agent!");
  console.log("=====================================");

  // Check for OpenAI API key
  let openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    console.log("Please provide your OpenAI API key:");
    console.log("You can either:");
    console.log("1. Set it as an environment variable: OPENAI_API_KEY=your_key_here");
    console.log("2. Enter it when prompted");
    console.log("");
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    openaiApiKey = await new Promise((resolve) => {
      rl.question("Enter your OpenAI API key: ", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  if (!openaiApiKey) {
    console.log("❌ OpenAI API key is required to run this application.");
    process.exit(1);
  }

  // Initialize the chat agent
  const agent = new ChatAgent();
  const initialized = await agent.initialize(openaiApiKey);

  if (!initialized) {
    console.log("❌ Failed to initialize the chat agent. Please check your API key and try again.");
    process.exit(1);
  }

  // Start the chat interface
  console.log("\n💬 Chat Agent is ready! You can now ask questions about AI.");
  console.log("Type 'quit' to exit, 'clear' to clear chat history, or 'help' for commands.");
  console.log("");

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question("You: ", async (userInput) => {
      const input = userInput.trim();

      if (input.toLowerCase() === "quit" || input.toLowerCase() === "exit") {
        console.log("👋 Goodbye!");
        rl.close();
        process.exit(0);
      } else if (input.toLowerCase() === "clear") {
        agent.clearChatHistory();
        askQuestion();
      } else if (input.toLowerCase() === "help") {
        console.log("\nAvailable commands:");
        console.log("- 'quit' or 'exit': Exit the application");
        console.log("- 'clear': Clear chat history");
        console.log("- 'help': Show this help message");
        console.log("- Any other text: Ask a question about AI\n");
        askQuestion();
      } else if (input === "") {
        askQuestion();
      } else {
        console.log("🤖 Assistant: Thinking...");
        const response = await agent.chat(input);
        console.log(`🤖 Assistant: ${response}\n`);
        askQuestion();
      }
    });
  };

  askQuestion();
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n👋 Goodbye!");
  process.exit(0);
});

// Run the application
main().catch((error) => {
  console.error("❌ Application error:", error);
  process.exit(1);
}); 