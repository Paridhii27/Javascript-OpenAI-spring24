import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  say("Welcome to escape AI");
  const escRooms = [
    {
      id: 1,
      name: "Data Dungeon",
      keyfeature: "Set underground with a lot of hidden tunnels",
    },
    {
      id: 2,
      name: "Cyborg Whispers",
      keyfeature: "There are creepers and vines across the edges of the room.",
    },
  ];

  say("Choose an escape room adventure to enter:");
  escRooms.forEach((room) => {
    say(`${room.id}. ${room.name}`);
  });

  const selectedRoomId = await ask("Enter the number of your choice:");

  const selectedRoom = escRooms.find(
    (room) => room.id === parseInt(selectedRoomId)
  );
  if (selectedRoom) {
    const roomDescription = await generateRoomDesc(selectedRoom.name);
    say(roomDescription);

    const inventory = await generateRoomInventory();

    if (parseInt(selectedRoomId) == 1) {
      say(inventory);
    } else if (parseInt(selectedRoomId) == 2) {
      say(inventory);
    } else {
      say("This room is still under wraps. Come back in a week.");
    }
  } else {
    say("Invalid choice. Please select a valid escape room.");
  }
}

async function generateRoomDesc(roomName) {
  const prompt = `Generate a description for an escape room called ${roomName}. Include descriptions of what the space looks like and what is the players first clue to escaping the ${roomName}. It also must have the feature of ${roomName.keyfeature}`;
  const response = await gptPrompt(prompt, {
    max_tokens: 5,
    temperature: 0.7,
  });
  return response;
}

async function generateRoomInventory() {
  const obj = await ask("State three objects you find in this room");
  const objPrompt = `Create an easy encryption puzzle based on the ${obj} in the space. Give the user three guesses to solve the puzzle. Do not give scenario background as this is part of an escape room where the player must make inferences just based on the space.`;
  const objResponse = await gptPrompt(objPrompt, {
    max_tokens: 200,
    temperature: 0.7,
  });
  say(objResponse);
}
