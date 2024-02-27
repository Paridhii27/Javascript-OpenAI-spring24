import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  say("Hi");

  // Taking user music preferences
  const singer = await ask("Who is your favorite singer?");
  const song = await ask("What is your favorite song?");
  const genre = await ask("Choose a music genre: ");

  // Generate a new playlist based on these user responses
  const playlistPrompt = `Give me a twelve song playlist based on the music genre ${genre} 
  and it should also include songs similar to those sung by ${singer} and influenced by the song "${song}.`;
  const playlistResponse = await gptPrompt(playlistPrompt, {
    max_tokens: 800,
    temperature: 0.7,
  });
  say(playlistResponse);

  // If the user was to direct a music video for a song what would it be like
  const songname = await ask(
    "If you were to write a song, what would it be called?"
  );
  const emotion = await ask("How does this song make you feel?");
  const landmark = await ask("Where is the music video set?");
  const object = await ask(
    "Is there a particular theme/ object featured in the video?"
  );

  // Generate questions for the music video direction
  const videoQPrompt = `You are the creative director for the music video of your original song "${songname}" 
  which evokes emotions such as "${emotion}", you need to create a captivating narrative with visual effects. 
  The video is set in "${landmark}" and will prominently feature the theme or object "${object}".
  To delve deeper into the creative process and ensure a comprehensive understanding of your vision, 
  consider the following aspects:

1. What is the overarching narrative or story conveyed in the music video? How does it reflect the emotions and themes of your song?
2. Who are the main characters or figures in your video, and how do their stories intertwine with the song's message?
3. Describe the visual style and atmosphere of the video. How do the chosen locations, lighting, and colors enhance the mood and theme? Does it work against or with the chosen theme?
4. What are some key scenes in the music video? How do they relate to the storyline of the music video?

Based on these considerations, generate exactly three questions that will help you flesh out the setting, characters, and narrative of your music video. Aim for questions that guide the creative direction and practical execution, such as figuring out specific scenes, is there a protagonist, how will the music video be shot etc
Compile these questions into a JavaScript array of strings, structured as follows: ["question 1", "question 2", "question 3"]. 
Include only the array, start with [ and end with ].`;

  const videoQResponse = await gptPrompt(videoQPrompt, {
    max_tokens: 800,
    temperature: 0.7,
  });

  say(`Response before parsing: ${videoQResponse}`);

  let questions = [];
  try {
    questions = JSON.parse(videoQResponse);
  } catch (_e) {
    say(`Error parsing questions string: "${videoQResponse}"`);
    return;
  }

  // Ask the questions and collect answers
  const answers = [];

  for (const q of questions) {
    const answer = ask(q);
    answers.push(answer);
  }

  // Create the music video narrative scene by scene
  const directionPrompt = `
  With the newly written song titled "${songname}", evoking "${emotion}", set in "${landmark}", featuring "${object}", and considering the answers: ${answers.join(
    ", "
  )}, 
  what would be a hypothetical narrative of the music video? Incorporate all these aspects to generate some scenes from the music video.
  `;

  const directionResponse = await gptPrompt(directionPrompt, {
    max_tokens: 1000,
    temperature: 0.7,
  });

  say(directionResponse);
}
