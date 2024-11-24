import LlamaStackClient from 'llama-stack-client';
import mongoClient from '@/lib/mongodb';
import geohash from 'ngeohash';
import { GeneratedEvent, Request } from './types';

const ENDPOINT = "https://llama-stack.together.ai";
const MODEL = "Llama3.1-8B-Instruct";

const llamaClient = new LlamaStackClient({ baseURL: ENDPOINT });

const requests = [{
    _id: "674254e4400daa7ce6e048dd",
    user: null,
    description: "Request for community park maintenance.",
    location: { lat: 40.7128, long: -74.006 },
    locationName: "Central Park",
    category: "maintenance",
    createdAt: "2024-03-01T12:00:00Z",
    upvoteCount: 0
}, {
    _id: "674254e4400daa7ce6e048de",
    user: null,
    description: "Request for new playground equipment.",
    location: { lat: 40.7128, long: -74.006 },
    locationName: "Riverside Park",
    category: "improvement",
    createdAt: "2024-03-02T12:00:00Z",
    upvoteCount: 0,
}] as Request[];

function groupRequestsByGeohash(requests: Request[], precision: number = 5) {
    return requests.reduce((groups, request) => {
        const hash = geohash.encode(request.location.lat, request.location.long, precision);
        if (!groups[hash]) groups[hash] = [];
        groups[hash].push(request);
        return groups;
    }, {} as Record<string, Request[]>);
}

function buildLlmPrompt(requests: Request[]) {
    const requestList = requests.map(req => `- ${req.description} (ID: ${req._id})`).join('\n');
    return `Based on these community requests:
${requestList}

Generate a JSON array of suggested community events. Each event should have:
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
        // Parse the initial response
        const responseJson: LlamaStackClient.InferenceChatCompletionResponse.ChatCompletionResponse =
            JSON.parse((response as unknown as string).slice(6));

        // Get the content string from the completion message
        const content = responseJson.completion_message.content;

        // Parse the content string directly into GeneratedEvent array
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

            suggestedEvents.forEach(event => {
                events.push({
                    ...event,
                    geohash,
                    confidence: event.confidence || 0.5,
                });
            });
        } catch (err) {
            console.error(`Failed to generate events for geohash ${geohash}:`, err);
        }
    }

    return events;
}

async function main() {
    try {
        if (!requests.length) {
            console.log("No unresolved requests found.");
            return;
        }

        const groupedRequests = groupRequestsByGeohash(requests);
        console.log("Grouped requests by geohash:", groupedRequests);

        const events = await generateEventsForGroup(groupedRequests);
        console.log("Generated events:", events);

    } catch (err) {
        console.error("Error in main function:", err);
    } finally {
        await mongoClient.close();
    }
}

main();
