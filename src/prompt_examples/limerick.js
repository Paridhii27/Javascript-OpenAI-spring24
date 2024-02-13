/**
 * This program prompts the user to enter their name and hometown
 * and then uses GPT-3 language model to generate a limerick about the user.
 */

import { gptPrompt } from "../shared/openai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  say("Hello, GPT!");

  const name = await ask("What is your name?");
  const town = await ask("Where are you from?");

  say("");

  const prompt = `My name is ${name} and I am from ${town}. 
    Create a haiku about me. Haikus have three lines. They don't rhyme. 
    It has five syllables in the first and third lines.
    It has seven syllables in the second line. 
    It conveys a single moment of insight based on observations. 
    It includes a seasonal reference`;

  const limerick = await gptPrompt(prompt, { temperature: 0.7 });
  say(`"""\n${limerick}\n"""`);
}
