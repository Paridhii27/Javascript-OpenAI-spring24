import * as fal from "npm:@fal-ai/serverless-client";
import { loadEnv } from "../shared/util.ts";
import * as log from "../shared/logger.ts";

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { makeImage } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";

import { Chalk } from "npm:chalk@5";

const env = loadEnv();
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");

fal.config({
  credentials: env.FAL_API_KEY, // or a$function that returns a string
});

const chalk = new Chalk({ level: 1 });

//Create a web server
const app = new Application();
const router = new Router();

// API routes
router.get("/api/gpt", async (ctx) => {
  const machineName = ctx.request.url.searchParams.get("name");
  const machineFeature = ctx.request.url.searchParams.get("feature");
  const limerickPrompt = `You have a ${machineName} and you are redesigning its interface to better incorporate a key feature which is ${machineFeature}. Give a points on things you would change to achieve this altered interface. Keep the points brief. The introduction before the pointers should either not be there at all or be only a few words.`;
  const result = await gptPrompt(limerickPrompt, {
    temperature: 0.7,
    max_tokens: 150,
  });
  ctx.response.body = result;
});

// add the DALL•E route
router.get("/api/dalle", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 1024);
  const result = await makeImage(shortPrompt);
  ctx.response.body = result;
});

router.get("/api/fal", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 1024);
  const result = await fal.subscribe("fal-ai/stable-cascade", {
    input: {
      prompt: shortPrompt,
      negative_prompt: "",
      first_stage_steps: 20,
      second_stage_steps: 10,
      guidance_scale: 4,
      image_size: "square_hd",
      num_images: 1,
      loras: [],
      enable_safety_checker: true,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        // update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });
  console.log("result", result);
  ctx.response.body = result.images[0].url;
});

router.get("/api/falfast", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 1024);
  const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
      prompt: shortPrompt,
      image_size: "square_hd",
      num_inference_steps: "4",
      num_images: 1,
      enable_safety_checker: true,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        // update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });
  console.log("result", result);
  ctx.response.body = result.images[0].url;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
