import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  say("Hi");

  // Ask for favorite singer and music genre first to generate the playlist
  const singer = await ask("Who is your favorite singer?");
  const genre = await ask("Choose a music genre: ");

  // Generate playlist based on the singer and genre
  const playlistPrompt = `Give me a ten song playlist based on the music genre ${genre} 
  and it should also include songs similar to those sung by ${singer}.`;
  const playlistResponse = await gptPrompt(playlistPrompt, {
    max_tokens: 800,
    temperature: 0.7,
  });
  say(playlistResponse);

  // Proceed to gather information for directing a music video
  const song = await ask("What is your favorite song?");
  const emotion = await ask("How are you feeling?");
  const object = await ask("Choose any object: ");

  // Generate questions for the music video direction
  const videoQuestionsPrompt = `Now imagine you're the creative director filming the music video for the song ${song}.
   What would the storyline of the music video be based on the chosen emotion ${emotion} and genre ${genre}?
   The video must feature a particular object which is ${object}.
   Generate 4 questions about the specifics of the music video such as location, people, time period etc, in order to create the setting.
    Provide the questions as a JavaScript array of strings like this: ["question 1", "question 2", "question 3", "question 4"].`;

  const videoQuestionsResponse = await gptPrompt(videoQuestionsPrompt, {
    max_tokens: 800,
    temperature: 0.7,
  });

  let questions;
  try {
    questions = JSON.parse(videoQuestionsResponse);
  } catch (error) {
    say(`Error parsing questions string: "${videoQuestionsResponse}"`);
    return;
  }

  // Initialize an empty array to collect answers
  let answers = [];

  // Ask the generated questions one by one and collect answers
  for (const question of questions) {
    const answer = await ask(question);
    answers.push(answer);
  }

  // Now create the music video direction based on collected answers
  const directionPrompt = `
    Based on the favorite song "${song}", the chosen emotion "${emotion}", and the object "${object}", here are the answers provided to the video direction questions: ${answers.join(
    ", "
  )}.
    Considering these elements, what would the storyline of the music video be? Provide a creative direction that incorporates all these aspects.
  `;

  const directionResponse = await gptPrompt(directionPrompt, {
    max_tokens: 1000,
    temperature: 0.7,
  });

  say(directionResponse);
}
