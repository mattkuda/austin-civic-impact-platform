import LlamaStackClient from 'llama-stack-client';
import mongoClient from '@/lib/mongodb';


// const ENDPOINT = "http://localhost:5001"
// const MODEL = "Llama-3.2-3B-Instruct-Turbo"
const ENDPOINT = "https://llama-stack.together.ai"
const MODEL = "Llama3.1-8B-Instruct"


// const requests = [{
//   _id: { "$oid": "674254e4400daa7ce6e048dd" },
//   userId: "user1",
//   description: "Request for community park maintenance.",
//   location: { "lat": { "$numberDouble": "40.7128" }, "long": { "$numberDouble": "-74.006" } },
//   locationName: "Central Park",
//   category: "maintenance",
//   createdAt: "2024-03-01T12:00:00Z",
//   upvoteCount: { "$numberInt": "0" }
// }, {
//   _id: { "$oid": "674254e4400daa7ce6e048de" },
//   userId: "user2",
//   description: "Request for new playground equipment.",
//   location: { "lat": { "$numberDouble": "40.7306" }, "long": { "$numberDouble": "-73.9352" } },
//   locationName: "Riverside Park",
//   category: "improvement",
//   createdAt: "2024-03-02T12:00:00Z",
//   upvoteCount: { "$numberInt": "0" }
// }]

export async function getRequests() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("acip");
    const requests = await db.collection("requests").find({}).toArray();
    console.log("Requests found", requests);
    return requests;
  } catch (e) {
    console.error("Failed to find requests:", e);
  } finally {
    await mongoClient.close();
  }
}

function parseLlmResponse(response: unknown) {
  const responseJson: LlamaStackClient.InferenceChatCompletionResponse.ChatCompletionResponse = JSON.parse((response as unknown as string).slice(6));
  return responseJson;
}

const llamaClient = new LlamaStackClient({ baseURL: ENDPOINT });
async function main() {
  try {
    const response = await llamaClient.inference.chatCompletion({
      messages: [{ role: 'user', content: 'Hello, how are you?' }],
      model: MODEL,
    });
    console.log(parseLlmResponse(response).completion_message.content);
  } catch (err) {
    console.error(err);
    if (err instanceof LlamaStackClient.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  }
}

main();
