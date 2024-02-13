import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

export async function main() {
  say("Hi");
  const genre = await ask("Choose a music genre: ");
  const singer = await ask("Who is your favourite singer?");
  const song = await ask("What is your favourite song?");
  const emotion = await ask("How are you feeling?");
  const object = await ask("Choose any object: ");

  say("");

  const prompt = `Give me a ten song playlist based on the music genre ${genre} 
  and it should also include songs similar to those sung by ${singer}.`;

  const response = await gptPrompt(prompt, {
    max_tokens: 800,
    temperature: 0.7,
  });

  say(`${response}`);

  const prompt2 = `Now imagine you're the creative director filming the music video for the song ${song}.
   What would the storyline of the music video be based on the chosen ${emotion} and ${genre}
   The video must feature a particular object which is ${object}.
   Generate 4 questions about the specifics of the music video such as location, people, time period etc in order to create the setting.
    provide the questions as a javascript array of strings like this:
    ["question 1", "question 2", "question 3", "question 4"]

    Include only the array, start with [ and end with ].`;

  const response2 = await gptPrompt(prompt2, {
    max_tokens: 800,
    temperature: 0.7,
  });

  let questions = [];
  try {
    questions = JSON.parse(response2);
  } catch (_e) {
    say(`Error parsing questions string: "${response2}"`);
    end();
    return;
  }

  say("");

  for (const q of questions) {
    const a = await ask(q);
    const response3 = await gptPrompt(
      `
    The question was '${q}'.
    The provided answer was '${a}'.
    How would these details help in determining the different scenes of the music video.
    What would the storyline of the music video be based on the chosen ${emotion} and ${genre} and all the answers ${a}.
    `,
      { max_tokens: 1000, temperature: 0.1 }
    );
    say(`${response3}`);
  }
}
