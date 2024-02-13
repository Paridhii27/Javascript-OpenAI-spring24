/**
 * This program "fakes" a text adventure game using Javascript and GPT.
 * It provides a basic loop which prompts the user for commands and then prompts
 * GPT with some high level instructions, the last few GPT responses
 * for context, and the users command.
 *
 * If the user "plays along" the experience is suprisingly similar to a true
 * text adventure game. But the user can easily "break" the game by issuing
 * outlandish commands.
 */

import { gptPrompt } from "../shared/openai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  say("Hello, Player!");

  const context = [];
  let playing = true;
  // const location = "woods";
  const location = "pluto";
  const player = {};
  player.name = await ask("What is your name?");
  player.orbit = await ask("How long have you been orbiting?");

  say("");

  while (playing) {
    const command = await ask("What do you want to do?");
    if (command == "quit") {
      playing = false;
    }

    const prompt = `
  This is a text adventure game.
  The player is named ${player.name} and they've been in outerspace for ${
      player.orbit
    } years.
  The current setting is ${location}.
 
  Recently: ${context.slice(-3).join(" ")}

  Respond in second person.
  Be breif, and avoid narating actions not taken by the player via commands.
  When describing locations mention places the player might go. Mention orbiting routes the player might take.
  Exit the game when the player says end of conversation. The tone is sci fi research.

  

  The player command is '${command}'. 
  `;

    const response = await gptPrompt(prompt, {
      max_tokens: 128,
      temperature: 0.5,
    });
    context.push(response);
    say(`\n${response}\n`);
  }
}
