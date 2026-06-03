// No need to import fetch, it's global in Node 18+

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { handle, text } = JSON.parse(event.body);

  if (!handle || !text) {
    return { statusCode: 400, body: JSON.stringify({ error: "Handle and text are required." }) };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GITHUB_PAT = process.env.GITHUB_PAT;
  const REPO_OWNER = "ashyyhere";
  const REPO_NAME = "cbse-accountability-log";
  const FILE_PATH = "src/queries.json";

  if (!GEMINI_API_KEY || !GITHUB_PAT) {
    console.error("Missing environment variables: GEMINI_API_KEY or GITHUB_PAT");
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
  }

  try {
    // 1. Verify with Gemini LLM
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `You are a moderator for a site tracking institutional failures in CBSE digital marking (OSM) and re-evaluation. 
    Analyze the following user-submitted message and determine if it is a relevant, valid complaint, issue, or report regarding CBSE evaluation, marking quality, scan issues, or security vulnerabilities in their systems.
    
    Message: "${text}"
    
    Respond with ONLY a valid JSON object in this format:
    {"valid": boolean, "category": "Evaluation Issues" | "Technical Glitches" | "Policy/Process" | "General Inquiry", "reason": "brief reason"}
    
    If it is spam, offensive, or completely unrelated to CBSE/OSM/evaluation, mark it as valid: false.`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiData = await geminiResponse.json();
    const resultText = geminiData.candidates[0].content.parts[0].text;
    
    // Clean potential markdown code blocks from LLM response
    const cleanedResult = resultText.replace(/```json|```/g, "").trim();
    const verification = JSON.parse(cleanedResult);

    if (!verification.valid) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: `Submission rejected by AI: ${verification.reason}` }) 
      };
    }

    // 2. Fetch current queries.json from GitHub
    const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const ghGetResponse = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: "application/vnd.github.v3+json",
      }
    });

    if (!ghGetResponse.ok) {
      throw new Error(`Failed to fetch file from GitHub: ${ghGetResponse.statusText}`);
    }

    const fileData = await ghGetResponse.json();
    const currentContent = JSON.parse(Buffer.from(fileData.content, "base64").toString("utf-8"));

    // 3. Append new entry
    const newEntry = {
      id: Date.now().toString(),
      text: text,
      handle: handle,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      category: verification.category || "Uncategorized",
    };

    const updatedContent = [newEntry, ...currentContent];
    const encodedContent = Buffer.from(JSON.stringify(updatedContent, null, 2)).toString("base64");

    // 4. Update file on GitHub
    const ghPutResponse = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_PAT}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add new student voice from ${handle}`,
        content: encodedContent,
        sha: fileData.sha,
      })
    });

    if (!ghPutResponse.ok) {
      const errorData = await ghPutResponse.json();
      throw new Error(`Failed to update file on GitHub: ${errorData.message}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success" })
    };

  } catch (error) {
    console.error("Error in submit-voice function:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to process submission." }) 
    };
  }
};
