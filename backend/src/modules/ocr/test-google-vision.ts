import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

async function test() {
  try {
    await client.getProjectId();

    console.log("✅ Google Vision authentication successful.");
  } catch (error) {
    console.error("❌ Google Vision authentication failed.");
    console.error(error);
  }
}

await test();
