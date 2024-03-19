import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

import {
  Checkbox,
  prompt,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

main();

async function main() {
  //Start of the game
  console.log(
    "%cWelcome to escape AI",
    "color: #b7b0eb; font-size: 25px; font-weight: bold;"
  );

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
      listPointer: ">",
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
    max_tokens: 100,
    temperature: 0.7,
  });
  return response;
}

async function generateRoomInventory() {
  console.log(
    "%cWelcome to Data Dungeon",
    "color: white; background-color: #6bbfbb; font-size: 25px; font-weight: bold;"
  );
  console.log(
    "%cIn this escape AI adventure, you find yourself getting puzzled by AI. You must solve the AI generative puzzle in a limited number of attempts to escape. Look closely at the objects around you in order to find hints to solve the puzzle.",
    "color: green; font-weight: bold;"
  );

  const chooseObj = await prompt([
    {
      name: "object",
      message:
        "Select three objects you see in the room that you think are key to escaping :",
      type: Checkbox,
      maxSelected: 3,
      listPointer: ">",
      options: [
        "book",
        "mirror",
        "torch",
        "plate",
        "recipes",
        "frame",
        "typewriter",
        "radio",
        "neon lamp",
      ],
    },
  ]);

  const objects = chooseObj.object;

  // Generate an encryption puzzle based on the objects provided by the player
  const { puzzleDescription, escapeAns } = await generateEncryptionPuzzle(
    objects
  );
  say("Here's your puzzle:");
  // Display the cipher puzzle to the player
  say(puzzleDescription);

  // Allow the player three attempts to solve the puzzle
  let remainingAttempts = 3;
  let solved = false;
  while (remainingAttempts > 0 && !solved) {
    const guess = await ask(
      `Guess the solution (${remainingAttempts} attempts remaining). Please enter your answer as a single word or a sequence of numbers without spaces:`
    );
    const normalizedGuess = guess.replace(/\s+/g, "").toLowerCase();
    const normalizedPuzzleAnswer = escapeAns.toLowerCase(); // Assuming puzzleAnswer is a string

    if (normalizedGuess === normalizedPuzzleAnswer) {
      console.log(
        "%cThe door creaks open, and a beam of sunlight floods the room. You've successfully escaped!",
        "color: red; font-weight: bold;"
      );
      // say(
      //   "The door creaks open, and a beam of sunlight floods the room. You've successfully escaped!"
      // );
      solved = true;
    } else {
      console.log(
        "%cNothing happens. The cipher remains unsolved. Keep trying!.",
        "color: red; font-weight: bold;"
      );
      // say("Nothing happens. The cipher remains unsolved. Keep trying!");
      remainingAttempts--;
    }
  }

  if (!solved) {
    say(
      `It seems that the code is incorrect. The system is locking down. Now you're kind of trapped. Better luck next time.`
    );
    say(`The correct answer of the puzzle is: "${escapeAns}".`); // Provide the correct answer after the attempts run out
  }
}

async function generateEncryptionPuzzle(objects) {
  // Generate an encryption puzzle based on the objects provided
  const puzzlePrompt = `Create an easy-to-solve cipher puzzle for a text based escape room adventure. The puzzle should involve three objects found within a room called "Data Dungeon". Use the following three objects: ${objects.join(
    ", "
  )}. Design the puzzle so each object conceals a part of the code or message. Combine these clues to form a straightforward answer that progresses the game. For instance, the objects might encode letters or numbers that, when put together, spell out a word or a numeric code. The puzzle explanation should end in only a few sentences.
  The puzzle should be solvable via text input, concise, and intuitive, allowing players to deduce the answer from the provided clues easily.After describing the puzzle, clearly state "Solution:" followed by the answer.`;
  const puzzleResponse = await gptPrompt(puzzlePrompt, {
    max_tokens: 300,
    temperature: 0.7,
  });

  const puzzleParts = puzzleResponse.split("Solution:");
  const puzzleDescription = puzzleParts[0].trim();
  const escapeAns = puzzleParts[1] ? puzzleParts[1].trim() : "";

  return { puzzleDescription, escapeAns };
}

// async function encryptionPuzzleAnswers(encryptionPuzzle) {
//   // Reveal the exact answer of the puzzle
//   const puzzleAnsPrompt = `Reveal the exact answer of the puzzle based on "${encryptionPuzzle}".`;
//   const puzzleAns = await gptPrompt(puzzleAnsPrompt, {
//     max_tokens: 100,
//     temperature: 0.4,
//   });

//   return puzzleAns;
// }

// Racing to win the word based human vs cyborg game

async function generateCyborgWhispers() {
  let cyborgScore = 0;
  let userScore = 0;

  console.log(
    "%cWelcome to Cyborg Whispers",
    "color: white; background-color: #56587a; font-size: 25px; font-weight: bold;"
  );
  console.log(
    "%cIn this escape AI adventure, you hear whispers of a cyborg who claims to have unlimited knowledge. So you both play a silly game of whispering rhyming words. You both get a word and need to think deeply and find as many rhymes as possible, whoever gets more wins. The machine goes first. If the machine wins, you accept defeat. Otherwise you escape their whispers.",
    "color: #97e1f0; font-weight: bold;"
  );

  // Generate a random word to begin the game
  const randomWord = await ask("Give a random word: ");

  // AI generates rhyming words
  const wordsPrompt = `Generate as many rhyming words as possible for the word "${randomWord}".`;
  const wordsResponse = await gptPrompt(wordsPrompt, {
    max_tokens: 100,
    temperature: 0.7,
  });

  // List of rhyming words from the AI
  const cyborgRhymes = wordsResponse
    .split("\n")
    .filter((word) => word.trim() !== "");

  // Prompt the user to provide their rhyming words
  const userResponse = await ask(
    `Now, try to list as many rhyming words for "${randomWord}" as you can: `
  );
  const userRhymes = userResponse
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word !== "");

  // Eliminate duplicates and count the number of unique rhyming words
  const uniqueUserRhymes = [...new Set(userRhymes)];

  // Display the AI's rhymes to the player for fairness
  say(`The AI came up with these rhyming words: ${cyborgRhymes.join(", ")}`);

  // Calculate scores
  cyborgScore = cyborgRhymes.length;
  userScore = uniqueUserRhymes.length;

  // Display the results
  say(`AI score: ${cyborgScore} rhymes`);
  say(`Your score: ${userScore} unique rhymes`);

  // Determine if the player escapes
  if (userScore > cyborgScore) {
    console.log(
      "%cWoohoo! You successfully escaped the cyborg whispers. What books you have been reading!!",
      "color: #ceedd8; font-weight: bold;"
    );
    // say(
    //   "Woohoo! You successfully escaped the cyborg whispers. What books you have been reading!!"
    // );
  } else if (userScore === cyborgScore) {
    console.log(
      "%cIt's a tie! Are you a cyborg?",
      "color: #faf882; font-weight: bold;"
    );
    // say("It's a tie! Are you a cyborg?");
  } else {
    console.log(
      "%cThe Cyborg beats you with its extensive vocabulary. Try again to escape its whispers.",
      "color: #fa6689; font-weight: bold;"
    );
    // say(
    //   "The Cyborg beats you with its extensive vocabulary. Try again to escape its whispers."
    // );
  }
}
