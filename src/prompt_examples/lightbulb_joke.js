import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  say("Knock, knock.");
  const subject = await ask("What kind of joke do you want to hear today?");

  say("");

  const prompt = `Tell me a lightbulb joke based on ${subject}.`;

  const response = await gptPrompt(prompt, {
    max_tokens: 1000,
    temperature: 0.7,
  });

  say(`${response}`);
}
