import LlamaStackClient from 'llama-stack-client';
// import mongoClient from '@/lib/mongodb';


// const ENDPOINT = "http://localhost:5001"
// const MODEL = "Llama-3.2-3B-Instruct-Turbo"
const ENDPOINT = "https://llama-stack.together.ai"
const MODEL = "Llama3.1-8B-Instruct"
const llamaClient = new LlamaStackClient({ baseURL: ENDPOINT });

const requests = [{
  _id: { "$oid": "674254e4400daa7ce6e048dd" },
  userId: "user1",
  description: "Request for community park maintenance.",
  location: { "lat": { "$numberDouble": "40.7128" }, "long": { "$numberDouble": "-74.006" } },
  locationName: "Central Park",
  category: "maintenance",
  createdAt: "2024-03-01T12:00:00Z",
  upvoteCount: { "$numberInt": "0" }
}, {
  _id: { "$oid": "674254e4400daa7ce6e048de" },
  userId: "user2",
  description: "Request for new playground equipment.",
  location: { "lat": { "$numberDouble": "40.7306" }, "long": { "$numberDouble": "-73.9352" } },
  locationName: "Riverside Park",
  category: "improvement",
  createdAt: "2024-03-02T12:00:00Z",
  upvoteCount: { "$numberInt": "0" }
}]


const getPrompt = (requests) => `Given these community requests, generate 1-3 themed volunteer events that could address them efficiently:
Requests:
${requests.map((req, i) => `
${i + 1}. Description: ${req.description}
   Location: ${req.locationName}
   Category: ${req.category}
`).join('\n')}

Generate volunteer events that could address these requests. If requests are similar or nearby, combine them into a single larger event.
For each event provide:
1. A clear title
2. Description of what volunteers will do
3. Which request(s) this event addresses (by number)
4. Estimated duration in hours
5. Recommended number of volunteers
6. Required materials or tools

Output response as JSON without any other text like this:
{
  "events": [
    {
      "title": "Event title",
      "description": "Detailed description",
      "addressesRequests": [1, 2],
      "duration": "number of hours",
      "volunteers": "recommended number",
      "materials": ["item1", "item2"]
    }
  ]
}`;


function parseLlmResponse(response: unknown) {
  const responseText = (response as unknown as string).slice(6);
  try {
    return JSON.parse(responseText) as LlamaStackClient.InferenceChatCompletionResponse.ChatCompletionResponse;
  } catch (e) {
    console.error("Failed to parse LLM response:", e);
  }
}

// Update the generateEventFromRequest function to handle multiple requests
export async function generateThemedEvents(requests: unknown[]) {
  try {
    const response = await llamaClient.inference.chatCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are an event planning assistant that helps organize community volunteer events efficiently by combining similar requests when possible.'
        },
        {
          role: 'user',
          content: getPrompt(requests)
        }
      ],
      model: MODEL,
    });

    return parseLlmResponse(response);
  } catch (err) {
    console.error("Failed to generate themed events:", err);
    throw err;
  }
}

// Update main function to test themed event generation
async function main() {
  try {
    if (requests && requests.length > 0) {
      const themedEvents = await generateThemedEvents(requests);
      console.log("Generated themed events:");
      console.log(JSON.parse(themedEvents.completion_message.content as string).events);
    }
  } catch (err) {
    console.error(err);
    if (err instanceof LlamaStackClient.APIError) {
      console.log(err.status);
      console.log(err.name);
      console.log(err.headers);
    } else {
      throw err;
    }
  }
}


// export async function getRequests() {
//   try {
//     await mongoClient.connect();
//     const db = mongoClient.db("acip");
//     const requests = await db.collection("requests").find({}).toArray();
//     console.log("Requests found", requests);
//     return requests;
//   } catch (e) {
//     console.error("Failed to find requests:", e);
//   } finally {
//     await mongoClient.close();
//   }
// }

main();
