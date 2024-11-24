import LlamaStackClient from 'llama-stack-client';
import { GeneratedEvent, Request } from './types';
import { ENDPOINT, MODEL } from './lib/utils';

const llamaClient = new LlamaStackClient({ baseURL: ENDPOINT });

function buildLlmPrompt(requests: Request[]) {
    const requestList = requests.map(req => `- ${req.description} (ID: ${req._id})`).join('\n');
    return `Based on these community requests:
${requestList}

Generate a JSON array of at most ${Math.floor(requests.length / 2)} suggested community events. Each event should have:
{
  "title": "string",
  "description": "string",
  "location": {
    "lat": number,
    "long": number
  },
  "requests": ["string"], // array of request IDs this event addresses
  "confidence": number // between 0 and 1
}

Respond with ONLY valid JSON, no additional text.`;
}

function parseLlmResponse(response: unknown): GeneratedEvent[] {
    try {
        const responseJson: LlamaStackClient.InferenceChatCompletionResponse.ChatCompletionResponse =
            JSON.parse((response as unknown as string).slice(6));
        const content = responseJson.completion_message.content;
        const events = JSON.parse(content as string) as GeneratedEvent[];
        console.log('Parsed events:', events);
        return events;
    } catch (error) {
        console.error("Failed to parse LLM response:", error);
        console.error("Raw response:", response);
        return [];
    }
}

async function generateEventsForGroup(groupedRequests: Record<string, Request[]>) {
    const events: GeneratedEvent[] = [];
    for (const [geohash, requests] of Object.entries(groupedRequests)) {
        const prompt = buildLlmPrompt(requests);
        try {
            console.log('LLM prompt', prompt);
            const response = await llamaClient.inference.chatCompletion({
                messages: [{ role: 'user', content: prompt }],
                model: MODEL,
            });
            console.log('LLM response', response);
            const suggestedEvents = parseLlmResponse(response);
            suggestedEvents.forEach(event => { events.push({ ...event, geohash, confidence: event.confidence || 0 }) });
        } catch (err) {
            console.error(`Failed to generate events for geohash ${geohash}:`, err);
        }
    }

    return events;
}

export async function generateEvents(unfilledRequests: Record<string, Request[]>) {
    try {
        if (!unfilledRequests.length) {
            console.log("No unresolved requests found.");
            return;
        }
        const events = await generateEventsForGroup(unfilledRequests);
        console.log("Generated events:", events);
        return events;
    } catch (err) {
        console.error("Error in main function:", err);
    }
}
