import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

import {
  Checkbox,
  prompt,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

main();

async function main() {
  //Start of the game
  say("Welcome to escape AI");

  //Defining the escape rooms
  const escRooms = [
    {
      id: 101001,
      name: "Data Dungeon",
      keyfeature: "Set underground with a lot of hidden tunnels",
    },
    {
      id: 282282,
      name: "Cyborg Whispers",
      keyfeature: "There are creepers and vines across the edges of the room.",
    },
  ];
  const chosenRoom = await prompt([
    {
      name: "rooms",
      message: "Select an escape room:",
      type: Checkbox,
      maxSelected: 1,
      options: escRooms.map((room) => `${room.id}. ${room.name}`), //chatgpt based line of code
    },
  ]);

  // Get the selected room ID
  const selectedRoomId = parseInt(chosenRoom.rooms[0].split(".")[0]); //chatgpt based line of code

  // Find the selected room
  const selectedRoom = escRooms.find((room) => room.id === selectedRoomId);

  //Checking if the player entered the escape room
  if (selectedRoom) {
    const roomDescription = await generateRoomDesc(selectedRoom.name);
    say(roomDescription);

    //Data dungeon
    if (parseInt(selectedRoomId) == 101001) {
      const inventory = await generateRoomInventory();
      say(inventory);
    }
    //Cyborg Whispers
    else if (parseInt(selectedRoomId) == 282282) {
      const whispers = await generateCyborgWhispers();
      say(whispers);
    }
    //More rooms to come
    else {
      say("This room is still under wraps. Come back in a week.");
    }
  }
  // Restart the experience and enter the correct room number
  else {
    say("Invalid choice. Please select a valid escape room.");
  }
}

//Generates what the escape room looks like and sets the tone
async function generateRoomDesc(roomName) {
  const prompt = `Generate a description for an escape room called ${roomName}. Include descriptions of what the space looks like and what is the players first clue to escaping the ${roomName}. It also must have the feature of ${roomName.keyfeature}`;
  const response = await gptPrompt(prompt, {
    max_tokens: 200,
    temperature: 0.7,
  });
  return response;
}

async function generateRoomInventory() {
  // say("Welcome to Data Dungeon");
  // say("In this escape AI adventure, you find yourself")
  console.log(
    "%cWelcome to Data Dungeon",
    "color: white; background-color: #545aab; font-size: 25px; font-weight: bold;"
  );
  console.log(
    "%cIn this escape AI adventure, you find yourself getting puzzled by AI. You must solve the AI generative puzzle in a limited number of attempts to escape. The objects around you help get hints to solve the puzzle.",
    "color: green; font-weight: bold;"
  );

  // Ask the player to state three objects found in the room
  const objects = await ask(
    "Enter any three objects you see in this room (comma-separated):"
  );

  // Generate an encryption puzzle based on the objects provided by the player
  const encryptionPuzzle = await generateEncryptionPuzzle(objects);
  say("Here's your puzzle:");

  // Display the encryption puzzle to the player
  say(encryptionPuzzle);

  // Allow the player three attempts to solve the puzzle
  let remainingAttempts = 3;
  let solved = false;
  while (remainingAttempts > 0 && !solved) {
    // Prompt the player to guess the solution
    const guess = await ask(
      `Guess the solution (${remainingAttempts} attempts remaining):`
    );

    // Check if the guess is correct
    if (guess.toLowerCase() === encryptionPuzzle.toLowerCase()) {
      say("Congratulations! You've solved the puzzle.");
      solved = true;
    } else {
      say("Incorrect guess. Keep trying!");
      remainingAttempts--;
    }

    console.log(
      "%cFeeling trapped in the overwhelming age of AI.",
      "color: #d0eb65; font-size: 20px; font-weight: bold;"
    );
  }

  // Display a message if the player runs out of attempts
  if (!solved) {
    say(`You've run out of attempts. Better luck next time!`);

    // Reveal the correct answer of the puzzle
    const puzzleAnswer = await encryptionPuzzleAnswers(encryptionPuzzle);
    say(`The correct answer of the puzzle is: "${puzzleAnswer}".`);
  }
}

async function generateEncryptionPuzzle(objects) {
  // Generate an encryption puzzle based on the objects provided
  const puzzlePrompt = `Create a really easy encryption puzzle based on the objects: ${objects}. Limit the size of encryption to 6 letters maximum. The puzzle explanation should end in only a few sentences. Make sure the puzzle can be answered as a string output.`;
  const puzzleResponse = await gptPrompt(puzzlePrompt, {
    max_tokens: 300,
    temperature: 0.7,
  });

  return puzzleResponse;
}

async function encryptionPuzzleAnswers(encryptionPuzzle) {
  // Reveal the exact answer of the puzzle
  const puzzleAnsPrompt = `Reveal the exact answer of the puzzle based on "${encryptionPuzzle}".`;
  const puzzleAns = await gptPrompt(puzzleAnsPrompt, {
    max_tokens: 100,
    temperature: 0.4,
  });

  return puzzleAns;
}

// Racing to win the word based human vs cyborg game
async function generateCyborgWhispers() {
  //Tracking word score
  let cyborgScore = 0;
  let userScore = 0;

  console.log(
    "%cWelcome to Cyborg Whispers",
    "color: white; background-color: #56587a; font-size: 25px; font-weight: bold;"
  );
  console.log(
    "%cIn this escape AI adventure, you hear whispers of a cyborg who claims to have unlimited knowledge. So you both play a silly game of rhyming words. You say a word and then need to type out as many rhyming words to it as possible in a given amount of time. If the cyborg gets more rhyming words than you, you lose. Otherwise you escape their whispers.",
    "color: #97e1f0; font-weight: bold;"
  );

  // Generate a random word to begin the game
  const randomWord = await ask("Give a random word:");

  // Function to start the timer
  function startTimer() {
    console.log("Timer started...");
    setTimeout(() => {
      console.log("Woohoo!");
    }, 20000); // 20 seconds
  }
  // Start the timer
  await startTimer();

  // Prompt the user to provide rhyming words
  const userRhymes = await ask(
    `Quickly! Give as many rhyming words to "${randomWord}" as possible within 20 seconds:`
  );

  // Generate rhyming words using GPT-3
  const wordsPrompt = `Generate as many rhyming words to "${randomWord}" as possible in 5 seconds. Keep a list of all the words generated. Print only the rhyming words.`;
  const wordsResponse = await gptPrompt(wordsPrompt, {
    max_tokens: 60,
    temperature: 0.7,
  });
  say(wordsResponse);

  // Count the number of words generated by the user and the cyborg
  const cyborgRhymes = wordsResponse.split("\n").filter(Boolean);

  // Calculate scores
  cyborgScore = cyborgRhymes.length;
  userScore = userRhymes.split(" ").filter(Boolean).length;

  // Display the results
  say(`Cyborg: ${cyborgScore} words`);
  say(`You: ${userScore} words`);

  console.log("Words Response:", wordsResponse);
  console.log("Cyborg Rhymes:", cyborgRhymes);

  //Determine if the player escapes
  if (cyborgScore > userScore) {
    say("The Cyborg beats you so you must try again");
  } else if (userScore > cyborgScore) {
    say("Wow you've successfully escaped the cyborg whispers");
  } else {
    say("It's a tie! Are you a cyborg?");
  }

  return wordsResponse;
}
