import * as fal from "npm:@fal-ai/serverless-client";
import { loadEnv } from "../shared/util.ts";
import * as log from "../shared/logger.ts";

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { makeImage } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";

import { Chalk } from "npm:chalk@5";

// tell the shared library code to log as much as possible
log.setLogLevel(log.LogLevel.DEBUG);

// Change the current working directory to the directory of this script
// This is necessary to serve static files with the correct path even
// when the script is executed from a different directory
Deno.chdir(new URL(".", import.meta.url).pathname);
// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

const env = loadEnv();
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");

fal.config({
  credentials: env.FAL_API_KEY, // or a$function that returns a string
});

const chalk = new Chalk({ level: 1 });

//Create a web server
const app = new Application();
const router = new Router();
let recipeCuisine, recipeFlavour, recipeCategory, recipeSpecification;

let dishName, twoFacts, recipeSteps;

router.get("/api/gpt", async (ctx) => {
  recipeCuisine = ctx.request.url.searchParams.get("cuisine");
  recipeFlavour = ctx.request.url.searchParams.get("flavour");
  recipeCategory = ctx.request.url.searchParams.get("category");
  recipeSpecification = ctx.request.url.searchParams.get("specification");

  const generateDishName = `
  In traditional ${recipeCuisine} cuisine, please generate ONLY THE NAME of the dish, with the following requirements:
  A dish with the flavor: ${recipeFlavour}, that's perfect for catagory: ${recipeCategory}, and meeting the specification: ${recipeSpecification}.
  DO NOT provide the whole recipe of the dish,
  ONLY provide the NAME of the dish, it should be WITHIN five word only
  `;

  dishName = await gptPrompt(generateDishName, {
    temperature: 1,
    max_tokens: 10,
  });

  const generateFacts = `
  You are a grandma who is a very good cook with expertise in traditional ${recipeCuisine} cuisine.
  With this dish name: ${dishName}, please respond ONLY two short fun facts about this dish
  DO NOT provide the whole recipe of the dish
  `;

  twoFacts = await gptPrompt(generateFacts, {
    temperature: 0.7,
    max_tokens: 2,
  });

  ctx.response.body = `${dishName} <br> ${twoFacts}`;
});

router.get("/api/gpt/recipe", async (ctx) => {
  const generateRecipe = `
    Generate the step-by-step recipe to make ${dishName}. 
    Please respond with ONLY the following:
    1. Ingredients (list all the ingredients required):
    2. Steps to make the dish (provide concise steps for preparing the dish):
    - Start with [step 1].
    - Then [step 2].
    - Next, [step 3].
    - Finally, [step 4].
    Please make sure each step is described briefly. 
    Keep the instructions clear and easy to follow.
`;

  recipeSteps = await gptPrompt(generateRecipe, {
    temperature: 1,
    max_tokens: 300,
  });

  ctx.response.body = recipeSteps;
});

router.post("/aiRequest", async (ctx) => {
  console.log("--START /aiRequest");
  try {
    const body = ctx.request.body();
    let data = await body.value;
    let askPrompt = data.input;

    const result = await gptPrompt(askPrompt, {
      temperature: 0.7,
      max_tokens: 150,
    });

    ctx.response.status = 200; // OK
    ctx.response.body = { ai: result };
  } catch (error) {
    console.error("Error:", error);
    context.response.status = 500;
    context.response.body = {
      error: "Failed to generate output. Please try again.",
    };
  }
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

console.log(chalk.green("\nListening on http://localhost:8001"));

await app.listen({ port: 8001, signal: createExitSignal() });

// router
//   .get("/", (context) => context.response.redirect("./public/index.html"))
//   .post("/submit", async (context) => {
//     try {
//       const { input } = await context.request.body().value;
//       const gptResponse = await gptPrompt(input);
//       context.response.body = { gpt: gptResponse };
//     } catch (error) {
//       console.error("Error:", error);
//       context.response.status = 500;
//       context.response.body = {
//         error: "Failed to generate output. Please try again.",
//       };
//     }
//   });
