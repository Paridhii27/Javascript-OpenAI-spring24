// import {
//   Checkbox,
//   Confirm,
//   Input,
//   Number,
//   prompt,
// } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

// const result = await prompt([
//   {
//     name: "name",
//     message: "What's your name?",
//     type: Input,
//   },
//   {
//     name: "age",
//     message: "How old are you?",
//     type: Number,
//   },
//   {
//     name: "like",
//     message: "Do you like animals?",
//     type: Confirm,
//   },
//   {
//     name: "animals",
//     message: "Select some animals",
//     type: Checkbox,
//     options: ["dog", "cat", "snake"],
//   },
// ]);

// console.log(result);

import { Checkbox } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

await Checkbox.prompt({
  message: "Select your favorite foods:",
  options: ["Pizza", "Burger", "Sushi", "Pasta"],
  listPointer: ">", // Custom list pointer
  selectedPointer: "✓", // Custom selected indicator
  unselectedPointer: "✗", // Custom unselected indicator
});
