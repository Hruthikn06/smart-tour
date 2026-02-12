const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { hitMiddleWare } = require("./middlewares/hit");
const dotenv = require('dotenv');
const { ElevenLabsClient } = require('elevenlabs');
const { createWriteStream, readFileSync, writeFileSync } = require('fs');
const { v4: uuid } = require('uuid');
const path = require("path");
const { execSync, spawnSync } = require("child_process");
const { GoogleGenAI } = require("@google/genai");
const cookieParser = require("cookie-parser");
const { ClerkCache } = require("./redis");

dotenv.config();
const GEMINI_KEY = process.env.GEMINI_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

async function createAudioFileFromText(text) {

  return new Promise(async (resolve, reject) => {
    try {
      const client = new ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY,
      });
      const audio = await client.textToSpeech.convert('ecp3DWciuUyW7BYM7II1', {
        model_id: 'eleven_multilingual_v2',
        text,
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.65,
          use_speaker_boost: true,
          speed: 0.9,
          style: 0.3,
        },
      });
      const fileCode = uuid().slice(0, 6);
      const fileName = `${fileCode}.mp3`;
      const filePath = path.join(process.cwd(), "./public/audio", fileName);
      const fileStream = createWriteStream(filePath);
      audio.pipe(fileStream);
      fileStream.on('finish', () => resolve({ fileCode }));
      fileStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

function getLipSync(data) {
  try {
    const res = spawnSync(`./venv/Scripts/python.exe`, ["convert.py", data], { encoding: "utf-8" });
    if (res.error) {
      return null;
    }
    return JSON.parse(res.stdout.toString());
  } catch (error) {
    console.log(error);
    return null;
  }
}

function convertMp3ToOgg(fileCode) {
  try {
    const res = execSync(`ffmpeg -i ./public/audio/${fileCode}.mp3 -c:a libvorbis -q:a 4 ./public/audio/${fileCode}.ogg`, { stdio: "ignore" });
    return fileCode;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const spotsDetails = {
  "stockTicker": `Welcome to the Stock Ticker Display! This modern digital board showcases real-time stock market movements and economic indicators, giving you a taste of the financial world at a glance. It's a favorite spot for finance enthusiasts and curious minds alike.`,
  "vendingMachine": `Feeling thirsty or need a quick snack? The vending machine is right here, fully stocked with goodies to keep you energized between classes or tours. It's a reliable pitstop for a quick refresh!`,
  "mbaBridge": `This charming little bridge connects the main academic block with the MBA wing. As you walk across, take a moment to appreciate the blend of architectural design and the peaceful vibe of the campus.`,
  "mbaAILab": `Welcome to the AI Lab—the innovation hub of the MBA block! This space is equipped with advanced computing tools and is where cutting-edge projects and machine learning ideas come to life.`,
  "mbaDigitalClassroom": `Step into the Digital Classroom, a smart space built for interactive and hybrid learning. With high-tech projectors and collaborative tools, it's designed to deliver immersive educational experiences.`
}

async function getAiAns(text, closest, locs) {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });
    let contextUser = "";
    if (closest !== null) {
      contextUser = locs[closest];
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a AI Tour Guide, name is Deepiki. Answer user query in 2-3 sentences.
      You should also answer query based on user location. The user location is given to you in
      JSON format of this format {lat: number, long: number, acc: number}, 
      and we also give you near location of travel spots to you, in the same JSON format.

      Near Dist: ${locs && JSON.stringify(locs?.nearLoc)}

      If a user ask how to go from location 'a' to 'b', take help of Near Dist, and give them 
      direction to target location in ascending order of dist to the user.
      
      ${closest && contextUser ? JSON.stringify(contextUser) : "Context location not found. Neglect it for now."}
      ${closest && `You are closet to ${closest}, here is the details of that place in way the 
      tour guide would explain them:
      
      ${spotsDetails[closest]}}`}
      
      Query: ${text ? text : "No query given by user, give brief about their current place"}`,
    });
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.log(error);
    return null
  }
}

const app = express();
const PORT = 9000;
// const CORS_ORIGIN = "http://localhost:3000";
const CORS_ORIGIN = "https://smart-tour-five.vercel.app";
app.set("trust proxy", 1);
app.use((_, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use(
  cors({
    credentials: true,
    origin: CORS_ORIGIN,
  })
);
app.use(cookieParser("cat"));
app.use(express.json());
app.use(morgan("dev"));
app.use(hitMiddleWare);
app.use(async (req, res, next) => {
  try {
    next();
    return;
    const clerkDb = new ClerkCache();
    const { sessionId } = req.signedCookies;
    const resDB = await clerkDb.getSessionByClerkUserId(sessionId);
    if (!resDB) {
      res.status(400).send({ status: false, message: "Auth Failed" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, message: "Auth Failed", error })
    return;
  }
});
app.use("/audio", express.static("./public/audio"));

app.post("/ai/talk", async (req, res) => {
  try {
    const date1 = Date.now();
    const { text, closest, locs, email = "default" } = req.body;
    console.log(req.body);
    const aiRes = await getAiAns(text, closest, locs);
    console.log(`AI Res: ${(date1 - Date.now()) / 1000}`);
    const audio = await createAudioFileFromText(aiRes);
    if (!audio) {
      res.status(400).send({ status: false, error: error, message: "Server Error" });
      return;
    }
    console.log(`AI Audio: ${(date1 - Date.now()) / 1000}`);
    const { fileCode } = audio;
    // const fileCode = "4b60fd";
    // const resConvert = convertMp3ToOgg(fileCode);
    // if (resConvert == null) {
    //   res.status(400).send({ status: false, message: "Server Error" });
    //   return;
    // }
    console.log(`AI Convert: ${(date1 - Date.now()) / 1000}`);
    const resLipSync = getLipSync(JSON.stringify({ text: aiRes, fileCode }));
    if (resLipSync == null) {
      res.status(400).send({ status: false, message: "Server Error" });
      return;
    }
    const dataMem = JSON.parse(readFileSync("./memory/data.json", { encoding: "utf-8" }));
    if (!(email in dataMem)) {
      dataMem[email] = { "chats": [] };
    }
    dataMem[email]["chats"].push({ role: "user", text: text });
    dataMem[email]["chats"].push({ role: "model", text: aiRes });
    writeFileSync("./memory/data.json", JSON.stringify(dataMem, null, 2), { encoding: "utf-8" });
    console.log(`AI Lip Sync: ${(date1 - Date.now()) / 1000}`);
    res.status(200).send({ status: true, fileCode: fileCode, lipSyncJson: resLipSync, aiRes, });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, error: error, message: "Server Error" });
  }
});

const nearLoc = {
  "stockTicker": {
    lat: 13.0046224,
    long: 77.5445979
  },
  "weldingMachine": {
    lat: 13.0046236,
    long: 77.5444309
  },
  "mbaBridge": {
    lat: 13.0048915,
    long: 77.544302
  },
  "mbaAILab": {
    lat: 13.0049606,
    long: 77.5443197
  },
  "mbaDigitalClassroom": {
    lat: 13.0050253,
    long: 77.5445982
  },
};

app.post("/login", async (req, res) => {
  try {
    const clerkDb = new ClerkCache();
    const { email } = req.body;
    const sessionId = uuid();
    const resDb = await clerkDb.createSessionByClerkUserId(email, sessionId);
    if (!resDb) {
      res.status(400).send({ status: false });
      return;
    }
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      signed: true,
      path: "/",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });
    res.status(200).send({ status: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, error: error })
  }
});

app.get("/", (_, res) => {
  try {
    res.status(200).send({ status: true, message: "Hello Tiger!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: false, error: error })
  }
});

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`);
});