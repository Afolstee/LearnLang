import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface WordDefinition {
  word: string;
  definition: string;
  culturalContext: string;
  nativeTranslation: string;
  exampleSentence: string;
}

export interface AdaptedArticle {
  title: string;
  content: string;
  summary: string;
  difficultyLevel: string;
  estimatedReadTime: number;
  culturalNotes: Record<string, string>;
  comprehensionQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export async function defineWord(
  word: string, 
  nativeLanguage: string,
  context?: string
): Promise<WordDefinition> {
  try {
    const { translateToNativeLanguage } = await import('./translate');
    
    const prompt = `
    Define the English word "${word}" for a native ${nativeLanguage} speaker learning English.
    ${context ? `Context: "${context}"` : ''}
    
    Provide:
    1. A clear, simple definition
    2. Cultural context explaining how this concept might differ in ${nativeLanguage} culture
    3. An example sentence using the word
    
    Do NOT include a translation - that will be handled separately.
    
    Respond with JSON in this format:
    {
      "word": "${word}",
      "definition": "clear definition",
      "culturalContext": "cultural explanation",
      "exampleSentence": "example sentence"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ESL teacher who specializes in cross-cultural language learning. Provide clear, educational definitions with cultural context."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Use Google Translate for the native translation
    let nativeTranslation = "";
    try {
      nativeTranslation = await translateToNativeLanguage(word, nativeLanguage as any);
    } catch (error) {
      console.error("Translation failed, using fallback:", error);
      nativeTranslation = word; // fallback to original word
    }
    
    return {
      ...result,
      nativeTranslation
    } as WordDefinition;
  } catch (error) {
    throw new Error("Failed to define word: " + (error as Error).message);
  }
}

export async function adaptArticle(
  originalText: string,
  targetLevel: string,
  nativeLanguage: string
): Promise<AdaptedArticle> {
  try {
    const prompt = `
    Adapt this English text for a ${targetLevel} level ESL learner whose native language is ${nativeLanguage}.
    
    Original text: "${originalText}"
    
    Please:
    1. Rewrite the content to match ${targetLevel} vocabulary and grammar complexity
    2. Add cultural notes for concepts that might be unfamiliar to ${nativeLanguage} speakers
    3. Create 3-5 comprehension questions with multiple choice answers
    4. Estimate reading time in minutes
    5. Generate an engaging title and summary
    
    Respond with JSON in this format:
    {
      "title": "engaging title",
      "content": "adapted content",
      "summary": "brief summary",
      "difficultyLevel": "${targetLevel}",
      "estimatedReadTime": number,
      "culturalNotes": {
        "word1": "cultural explanation",
        "word2": "cultural explanation"
      },
      "comprehensionQuestions": [
        {
          "question": "question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "why this is correct"
        }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ESL curriculum designer who creates culturally-aware learning materials."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as AdaptedArticle;
  } catch (error) {
    throw new Error("Failed to adapt article: " + (error as Error).message);
  }
}

export async function generateComprehensionQuestions(
  articleContent: string,
  difficultyLevel: string
): Promise<Array<{
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}>> {
  try {
    const prompt = `
    Create 5 comprehension questions for this ${difficultyLevel} level English article:
    
    "${articleContent}"
    
    Questions should test:
    - Main idea comprehension
    - Detail recall
    - Vocabulary understanding
    - Inference skills
    - Cultural understanding
    
    Respond with JSON in this format:
    {
      "questions": [
        {
          "question": "question text",
          "options": ["option A", "option B", "option C", "option D"],
          "correctAnswer": 0,
          "explanation": "detailed explanation of correct answer"
        }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ESL assessment creator who designs effective comprehension questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    throw new Error("Failed to generate comprehension questions: " + (error as Error).message);
  }
}
