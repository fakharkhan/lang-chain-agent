import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testLangChain() {
  console.log("🧪 Testing LangChain setup...");
  
  const provider = (process.env.LLM_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : "ollama")).toLowerCase();

  try {
    // Test basic LangChain functionality
    let model;
    if (provider === "ollama") {
      const { ChatOllama } = await import("@langchain/community/chat_models/ollama");
      const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
      const ollamaModel = process.env.OLLAMA_MODEL || "llama3.1";
      model = new ChatOllama({ baseUrl, model: ollamaModel, temperature: 0 });
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.log("❌ No OpenAI API key found. Set OPENAI_API_KEY or use LLM_PROVIDER=ollama.");
        return;
      }
      model = new ChatOpenAI({
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo",
        temperature: 0,
      });
    }

    const prompt = PromptTemplate.fromTemplate("Say hello to {name}!");
    
    const chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({ name: "LangChain" });
    console.log("✅ LangChain test successful!");
    console.log("Response:", result);
    console.log("\n🎉 Your setup is ready! Run 'npm start' to start the chat agent.");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("Please check your OpenAI API key and internet connection.");
  }
}

testLangChain(); 
