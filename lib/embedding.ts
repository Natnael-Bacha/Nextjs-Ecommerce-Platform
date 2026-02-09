import { pc } from "../config/pinecone.js";

async function generateStoryEmbedding(storyText: string) {
  try {
    const embeddings = await pc.inference.embed(
      "multilingual-e5-large",
      [storyText],
      { input_type: "passage" },
    );

    return embeddings.data[0].values;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    throw error;
  }
}

async function generateQueryEmbedding(queryText: string) {
  const embeddings = await pc.inference.embed(
    "multilingual-e5-large",
    [queryText],
    { input_type: "query" },
  );
  return embeddings.data[0].values;
}

// export async function upsertEmbeddings(userProfile) {
//     const index = pc.index('story-embeddings');
//     const embedding = await generateStoryEmbedding(userProfile.story);
//     const vector = {
//         id: `vec_${userProfile._id}`,
//         values: embedding,
//         metadata: {
//             profileId: userProfile._id.toString(),
//             createdAt: new Date().toISOString()
//         }
//     }

//     await index.upsert([vector]);
//     console.log(`Successfully upserted vectors.`);
// }

// export async function searchPinecone(userProfile, topK = 10) {

//     try {
//         const storyEmbedding = await generateQueryEmbedding(userProfile.story)
//         const index = pc.index('story-embeddings');
//         const results = await index.query({
//             vector: storyEmbedding,
//             topK: topK,
//             includeMetadata: true,
//             includeValues: true,
//         });

//         const searchResults = results.matches.map(match => ({
//             score: match.score,
//             profileId: match.metadata.profileId,
//             createdAt: match.metadata.createdAt
//         }))

//         console.log(`Found ${searchResults.length} results`);
//         return searchResults;
//     } catch (error) {
//         console.error('Error searching stories:', error);
//         throw error;
//     }
// }
