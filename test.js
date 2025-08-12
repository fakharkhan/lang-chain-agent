import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testLangChain() {
  console.log("🧪 Testing LangChain setup...");
  
  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log("❌ No OpenAI API key found. Please set OPENAI_API_KEY environment variable.");
    console.log("You can also run the main application which will prompt for the key.");
    return;
  }

  try {
    // Test basic LangChain functionality
    const model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

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