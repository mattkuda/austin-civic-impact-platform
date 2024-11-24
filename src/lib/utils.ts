import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const ENDPOINT = "https://llama-stack.together.ai";
export const MODEL = "Llama3.1-8B-Instruct";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}
