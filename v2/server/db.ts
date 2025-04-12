import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

// Use a different schema name for v2 to avoid conflicts with v1
const V2_SCHEMA = 'tariffsmart_v2';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Helper function to initialize the database with some sample data
export async function initializeDatabase() {
  console.log("Checking if v2 database needs initialization...");
  
  // Check if any modules exist
  const moduleCheck = await db.select().from(schema.modules).limit(1);
  
  if (moduleCheck.length === 0) {
    console.log("Initializing v2 database with sample data...");
    
    // Add some sample modules
    await db.insert(schema.modules).values([
      {
        title: "What are Tariffs?",
        description: "Learn the basics of tariffs and how they affect international trade.",
        order: 1,
        content: JSON.stringify({
          sections: [
            {
              type: "text",
              content: "A tariff is a tax imposed by a government on goods and services imported from other countries. Tariffs serve several purposes...",
            },
            {
              type: "image",
              url: "/assets/tariff-illustration.svg",
              caption: "How tariffs work in international trade",
            }
          ]
        }),
        estimatedMinutes: 5
      },
      {
        title: "Understanding Free Trade",
        description: "Explore the principles and benefits of free trade agreements.",
        order: 2,
        content: JSON.stringify({
          sections: [
            {
              type: "text",
              content: "Free trade is a policy followed by some international markets in which countries' governments do not restrict imports from, or exports to, other countries...",
            }
          ]
        }),
        estimatedMinutes: 7
      }
    ]);
    
    // Add some dictionary terms
    await db.insert(schema.dictionaryTerms).values([
      {
        term: "Tariff",
        definition: "A tax imposed by a government on goods and services imported from other countries.",
        category: "Basic Concepts"
      },
      {
        term: "Free Trade",
        definition: "A policy followed by some international markets in which countries' governments do not restrict imports from, or exports to, other countries.",
        category: "Trade Policies"
      },
      {
        term: "Quota",
        definition: "A government-imposed limit on the quantity or value of a good that can be imported during a specific time period.",
        category: "Trade Restrictions"
      }
    ]);
    
    // Add a sample quiz
    const [quiz] = await db.insert(schema.quizzes).values({
      title: "Tariff Basics Quiz",
      description: "Test your knowledge of basic tariff concepts",
      moduleId: 1,
      isStandalone: false,
      type: "multiple-choice"
    }).returning();
    
    // Add some quiz questions
    await db.insert(schema.quizQuestions).values([
      {
        quizId: quiz.id,
        question: "What is the primary purpose of a tariff?",
        options: JSON.stringify([
          "To reduce domestic consumption",
          "To protect domestic industries from foreign competition",
          "To increase international travel",
          "To promote immigration"
        ]),
        correctAnswer: "To protect domestic industries from foreign competition",
        explanation: "Tariffs are primarily used as a protectionist measure to shield domestic industries from foreign competition by making imported goods more expensive.",
        order: 1
      },
      {
        quizId: quiz.id,
        question: "Who typically pays for tariffs?",
        options: JSON.stringify([
          "Only foreign exporters",
          "Only domestic importers",
          "Ultimately, domestic consumers through higher prices",
          "Foreign governments exclusively"
        ]),
        correctAnswer: "Ultimately, domestic consumers through higher prices",
        explanation: "While tariffs are initially paid by importers, the cost is typically passed on to domestic consumers through higher retail prices.",
        order: 2
      }
    ]);
    
    // Add a trade agreement summary
    await db.insert(schema.tradeAgreements).values({
      name: "USMCA (United States-Mexico-Canada Agreement)",
      shortDescription: "A free trade agreement between the United States, Mexico, and Canada that replaced NAFTA in 2020.",
      fullDescription: "The United States-Mexico-Canada Agreement (USMCA) is a free trade agreement between Canada, Mexico, and the United States that replaced the North American Free Trade Agreement (NAFTA). It was signed on November 30, 2018, and took effect on July 1, 2020.",
      keyPoints: JSON.stringify([
        "Increased regional content requirements for automotive manufacturing",
        "Enhanced labor protections in Mexico",
        "Updated intellectual property provisions",
        "New digital trade chapter"
      ])
    });
    
    console.log("Database initialization complete!");
  } else {
    console.log("v2 database already contains data, skipping initialization");
  }
}