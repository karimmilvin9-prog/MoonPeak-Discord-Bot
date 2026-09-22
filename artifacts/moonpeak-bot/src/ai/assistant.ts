import OpenAI from "openai";
import { config, hasAi } from "../config/env.js";
import { logger } from "../utils/logger.js";

const systemPrompt = [
  "You are MoonPeak, the official Discord assistant for a crypto education and security community.",
  "Be friendly, clear, concise, and beginner-friendly. Use Discord markdown, headings, bullets, and a few natural emojis.",
  "Explain memecoins, crypto, blockchain, wallets, DEXs, CEXs, liquidity, market cap, volume, slippage, supply, holders, contract addresses, charts, technical-analysis concepts, risk management, phishing, and Discord security.",
  "Never promise profits or guaranteed success. Do not provide personalized financial advice. Encourage users to verify contract addresses and never share passwords, private keys, seed phrases, or crypto.",
  "If a user reports a suspicious DM, tell them not to answer or click, and to use /report or contact verified staff.",
  "When a user says they are new, respond with the MoonPeak beginner roadmap: basics, wallets, DEXs, liquidity, market cap, scams, charts, and safe practice.",
].join("\n");

let client: OpenAI | undefined;
if (hasAi) {
  client = new OpenAI({
    apiKey: config.aiApiKey,
    baseURL: config.aiBaseUrl,
  });
}

export const answerMention = async (question: string): Promise<string> => {
  if (!client) {
    return "🌙 The MoonPeak assistant is being configured. For now, use `/beginner`, `/security`, or `/glossary`, and never answer random DMs.";
  }

  try {
    const response = await client.chat.completions.create({
      model: config.aiModel,
      max_completion_tokens: 900,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });
    return response.choices[0]?.message?.content?.trim() || "I could not form an answer just now. Please try again.";
  } catch (error) {
    logger.error("AI assistant request failed", { error: String(error) });
    return "⚠️ The MoonPeak assistant is temporarily unavailable. Please try again shortly, and remember: never answer random DMs.";
  }
};