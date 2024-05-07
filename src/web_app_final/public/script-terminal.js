// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
let quizs;
let quizArray;
let recipeList;
let recipeArray;
const dishName = localStorage.getItem("dishName");
console.log("Received Dish Name:", dishName);
const recipeName = dishName;
// function fetchDataAndGenerateRecipe() {
// const cuisineName = document.getElementById("cuisine");
// const flavourName = document.getElementById("flavour");
// const categoryName = document.getElementById("category");
// const specificationName = document.getElementById("specification");
//   fetch(`/api/gpt/`)
//     .then((response) => response.json()) // Parse response as JSON
//     .then((data) => {
//       // Extract dishName from the response data
//       const dishName = data.dishName;
//       console.log(dishName);
//       recipeName = dishName;
//       // Use the retrieved dishName to generate recipe and quiz
//       generateRecipe(recipeName);
//       generateQuiz(recipeName);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

$(document).ready(function () {
  termRight = $("#commandDivRight").terminal(
    {
      quiz: async function () {
        // this.echo("--quiz Start!");
        await generateQuiz();

        askQuiz(quizArray, this, 0);
      },
    },
    {
      greetings: "",
    }
  );
  termRight.exec("quiz"); //DEBUG PURPOSE!

  setTimeout(function () {
    termRight.echo(`\n--recipe quiz session initiating--\n`);
  }, 1000);
});

$(document).ready(function () {
  termLeft = $("#commandDivLeft").terminal(
    {
      recipe: async function () {
        await generateRecipe();

        askRecipe(recipeArray, this, 0);
      },
    },
    {
      greetings: "",
    }
  );
  termLeft.exec("recipe"); //DEBUG PURPOSE!.

  setTimeout(function () {
    termLeft.echo(`\n--recipe steps session initiating--`);
  }, 1000);
});

async function generateRecipe() {
  const recipeGeneratePrompt = `
Based on this recipe ${recipeName}, 
Please LIST OUT the 5 steps to complete this recipe.
ONLY output the STEPS,
Give the steps in the format 
Step 1: 
Step 2:
make sure the all the steps are WITHIN a sentence
DO NOT output anything else`;

  // const modifiedPrompt = recipeGeneratePrompt.replace(/([^.]*\.)/g, "\n$1");
  // recipeList = await requestAI(modifiedPrompt);

  recipeList = await requestAI(recipeGeneratePrompt);

  recipeArray = recipeList.split("\n").filter((line) => line.trim() !== "");

  console.log(recipeArray);
}

async function generateQuiz() {
  const quizGeneratePrompt = `
Based on this recipe ${recipeName}, 
Please list 5 yes or no fun facts of this recipe.
ONLY output the 5 facts,
DO NOT provide the answer.`;

  quizs = await requestAI(quizGeneratePrompt);

  quizArray = quizs.split("\n").filter((line) => line.trim() !== "");

  // console.log(quizArray);
}

function askQuiz(quizArray, terminal, quizIndex) {
  if (quizIndex < quizArray.length) {
    const currentQuiz = quizArray[quizIndex];
    terminal.echo(`${currentQuiz}`);
    terminal.push(
      async function (command) {
        const userAns = `You are a grandma that are playing a fun fact game with your grandchild,
        This is the question: ${currentQuiz}, and the answer is ${command}, 
        please explain in ONLY one sentence why it is right or wrong`;

        await requestAI(userAns).then((aiResponse) => {
          terminal.echo(`\nGrandma: ${aiResponse}`);
          terminal.pop();
        });

        quizIndex++;
        // terminal.pop();
        this.echo("");
        askQuiz(quizArray, this, quizIndex);
      },
      {
        prompt: "(y/n) ",
        greetings: "",
      }
    );
  } else {
    terminal.echo("\nYou've completed all the quiz! Good Job!");
    // terminal.pop();
  }
}

function askRecipe(recipeArray, terminal, stepIndex) {
  if (stepIndex < recipeArray.length) {
    const currentStep = recipeArray[stepIndex];
    terminal.echo(`\n${currentStep}`);
    terminal.push(
      async function (command) {
        if (command.match(/yes|y/i)) {
          terminal.echo("\nPlease type your question:");
          terminal.push(
            function (userInput) {
              const recipePrompt = `You are a grandma that are teaching your grandkid how to cook ${recipeName},
          This is the current cooking step: ${currentStep}, and the question is ${userInput}, 
          please explain in ONLY one sentence`;

              requestAI(recipePrompt).then((aiResponse) => {
                terminal.echo(`\nGrandma: ${aiResponse}`);
                terminal.pop(); //end terminal
              });
            },
            {
              prompt: "> ",
            }
          );
        } else if (command.match(/no|n/i)) {
          terminal.pop();
          askRecipe(recipeArray, terminal, stepIndex + 1);
        } else {
          terminal.echo("\nPlease answer 'yes' or 'no'.");
        }
      },
      {
        prompt: "\nDo you have any questions about this step? (y/n) ",
        greetings: "",
      }
    );
  } else {
    terminal.echo("\nYou've completed all the steps of the recipe!");
    terminal.pop();
  }
}

// ---------- AI ---------- //
// ---------- AI ---------- //
// ---------- AI ---------- //
// ---------- AI ---------- //
// ---------- AI ---------- //

async function requestAI(input) {
  const response = await fetch("/aiRequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: input, max_tokens: 1000 }),
  });

  if (response.ok) {
    const jsonData = await response.json();

    console.log("--AI DONE");
    // console.log(jsonData.ai);
    return jsonData.ai;
  } else {
    console.error("Error in submitting data.");
    return "Error in submitting data.";
  }
}

// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //

// const dishName = JSON.parse(localStorage.getItem("dishName"));
// let quizs;
// let quizArray;

// let recipeArray;
// // let recipeName;
// let recipeName;

// $(document).ready(function () {
//   termRight = $("#commandDivRight").terminal(
//     {
//       quiz: async function () {
//         // this.echo("--quiz Start!");
//         await generateQuiz();

//         askQuiz(quizArray, this, 0);
//       },
//     },
//     {
//       greetings: "",
//     }
//   );
//   termRight.exec("quiz"); //DEBUG PURPOSE!

//   setTimeout(function () {
//     termRight.echo(`\n--recipe quiz session initiating--\n`);
//   }, 1000);
// });

// $(document).ready(function () {
//   termLeft = $("#commandDivLeft").terminal(
//     {
//       recipe: async function () {
//         await generateRecipe();

//         askRecipe(recipeArray, this, 0);
//       },
//     },
//     {
//       greetings: "",
//     }
//   );
//   termLeft.exec("recipe"); //DEBUG PURPOSE!.

//   setTimeout(function () {
//     termLeft.echo(`\n--recipe quiz session initiating--`);
//   }, 1000);
// });

// async function generateRecipe() {
//   const recipeGeneratePrompt = `
// Based on this recipe ${recipeName},
// Please LIST OUT the 5 steps to complete this recipe.
// ONLY output the STEPS,
// make sure the all the steps are WITHIN a sentence
// DO NOT output anything else`;

//   const recipeList = await requestAI(recipeGeneratePrompt);

//   recipeArray = recipeList.split("\n").filter((line) => line.trim() !== "");

//   // console.log(recipeArray);
// }

// async function generateQuiz() {
//   const quizGeneratePrompt = `
// Based on this recipe ${recipeName},
// Please list 5 yes or no fun facts of this recipe.
// ONLY output the 5 facts,
// DO NOT provide the answer.`;

//   quizs = await requestAI(quizGeneratePrompt);

//   quizArray = quizs.split("\n").filter((line) => line.trim() !== "");

//   // console.log(quizArray);
// }

// function askQuiz(quizArray, terminal, quizIndex) {
//   if (quizIndex < quizArray.length) {
//     const currentQuiz = quizArray[quizIndex];
//     terminal.echo(`${currentQuiz}`);
//     terminal.push(
//       async function (command) {
//         const userAns = `You are a grandma that are playing a fun fact game with your grandchild,
//         This is the question: ${currentQuiz}, and the answer is ${command},
//         please explain in ONLY one sentence why it is right or wrong`;

//         await requestAI(userAns).then((aiResponse) => {
//           terminal.echo(`\nGrandma: ${aiResponse}`);
//           terminal.pop();
//         });

//         quizIndex++;
//         // terminal.pop();
//         this.echo("");
//         askQuiz(quizArray, this, quizIndex);
//       },
//       {
//         prompt: "(y/n) ",
//         greetings: "",
//       }
//     );
//   } else {
//     terminal.echo("\nYou've completed all the quiz! Good Job!");
//     // terminal.pop();
//   }
// }

// function askRecipe(recipeArray, terminal, stepIndex) {
//   if (stepIndex < recipeArray.length) {
//     const currentStep = recipeArray[stepIndex];
//     terminal.echo(`\nStep ${currentStep}`);
//     terminal.push(
//       function (command) {
//         if (command.match(/yes|y/i)) {
//           terminal.echo("\nPlease type your question:");
//           terminal.push(
//             function (userInput) {
//               const recipePrompt = `You are a grandma that are teaching your grandkid how to cook ${recipeName},
//           This is the current cooking step: ${currentStep}, and the question is ${userInput},
//           please explain in ONLY one sentence`;

//               requestAI(recipePrompt).then((aiResponse) => {
//                 terminal.echo(`\nGrandma: ${aiResponse}`);
//                 terminal.pop(); //end terminal
//               });
//             },
//             {
//               prompt: "> ",
//             }
//           );
//         } else if (command.match(/no|n/i)) {
//           terminal.pop();
//           askRecipe(recipeArray, terminal, stepIndex + 1);
//         } else {
//           terminal.echo("\nPlease answer 'yes' or 'no'.");
//         }
//       },
//       {
//         prompt: "\nDo you have any questions about this step? (y/n) ",
//         greetings: "",
//       }
//     );
//   } else {
//     terminal.echo("\nYou've completed all the steps of the recipe!");
//     terminal.pop();
//   }
// }

// // ---------- AI ---------- //
// // ---------- AI ---------- //
// // ---------- AI ---------- //
// // ---------- AI ---------- //
// // ---------- AI ---------- //

// async function requestAI(input) {
//   const response = await fetch("/aiRequest", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ input: input, max_tokens: 1000 }),
//   });

//   if (response.ok) {
//     const jsonData = await response.json();

//     console.log("--AI DONE");
//     // console.log(jsonData.ai);
//     return jsonData.ai;
//   } else {
//     console.error("Error in submitting data.");
//     return "Error in submitting data.";
//   }
// }

// // ---------- TERMINAL ---------- //
// // ---------- TERMINAL ---------- //
// // ---------- TERMINAL ---------- //
// // ---------- TERMINAL ---------- //
// // ---------- TERMINAL ---------- //

// const recipeName = "tiramisu";

// let quizs;
// let quizArray;

// let recipeArray;

// $(document).ready(function () {
//   termRight = $("#commandDivRight").terminal(
//     {
//       quiz: async function () {
//         // this.echo("--quiz Start!");
//         await generateQuiz();

//         askQuiz(quizArray, this, 0);
//       },
//     },
//     {
//       greetings: "",
//     }
//   );
//   termRight.exec("quiz"); //DEBUG PURPOSE!

//   setTimeout(function () {
//     termRight.echo(`\n--recipe quiz session initiating--\n`);
//   }, 1000);
// });

// $(document).ready(function () {
//   termLeft = $("#commandDivLeft").terminal(
//     {
//       recipe: async function () {
//         await generateRecipe();

//         askRecipe(recipeArray, this, 0);
//       },
//     },
//     {
//       greetings: "",
//     }
//   );
//   termLeft.exec("recipe"); //DEBUG PURPOSE!.

//   setTimeout(function () {
//     termLeft.echo(`\n--recipe quiz session initiating--`);
//   }, 1000);
// });

// async function generateRecipe() {
//   const recipeGeneratePrompt = `
// Based on this recipe ${recipeName},
// Please LIST OUT the 5 steps to complete this recipe.
// ONLY output the STEPS,
// make sure the all the steps are WITHIN a sentence
// DO NOT output anything else`;

//   const recipeList = await requestAI(recipeGeneratePrompt);

//   recipeArray = recipeList.split("\n").filter((line) => line.trim() !== "");

//   // console.log(recipeArray);
// }

// async function generateQuiz() {
//   const quizGeneratePrompt = `
// Based on this recipe ${recipeName},
// Please list 5 yes or no fun facts of this recipe.
// ONLY output the 5 facts,
// DO NOT provide the answer.`;

//   quizs = await requestAI(quizGeneratePrompt);

//   quizArray = quizs.split("\n").filter((line) => line.trim() !== "");

//   // console.log(quizArray);
// }

// function askQuiz(quizArray, terminal, quizIndex) {
//   if (quizIndex < quizArray.length) {
//     const currentQuiz = quizArray[quizIndex];
//     terminal.echo(`${currentQuiz}`);
//     terminal.push(
//       async function (command) {
//         const userAns = `You are a grandma that are playing a fun fact game with your grandchild,
//         This is the question: ${currentQuiz}, and the answer is ${command},
//         please explain in ONLY one sentence why it is right or wrong`;

//         await requestAI(userAns).then((aiResponse) => {
//           terminal.echo(`\nGrandma: ${aiResponse}`);
//           terminal.pop();
//         });

//         quizIndex++;
//         // terminal.pop();
//         this.echo("");
//         askQuiz(quizArray, this, quizIndex);
//       },
//       {
//         prompt: "(y/n) ",
//         greetings: "",
//       }
//     );
//   } else {
//     terminal.echo("\nYou've completed all the quiz! Good Job!");
//     // terminal.pop();
//   }
// }

// function askRecipe(recipeArray, terminal, stepIndex) {
//   if (stepIndex < recipeArray.length) {
//     const currentStep = recipeArray[stepIndex];
//     terminal.echo(`\nStep ${currentStep}`);
//     terminal.push(
//       function (command) {
//         if (command.match(/yes|y/i)) {
//           terminal.echo("\nPlease type your question:");
//           terminal.push(
//             function (userInput) {
//               const recipePrompt = `You are a grandma that are teaching your grandkid how to cook ${recipeName},
//           This is the current cooking step: ${currentStep}, and the question is ${userInput},
//           please explain in ONLY one sentence`;

//               requestAI(recipePrompt).then((aiResponse) => {
//                 terminal.echo(`\nGrandma: ${aiResponse}`);
//                 terminal.pop(); //end terminal
//               });
//             },
//             {
//               prompt: "> ",
//             }
//           );
//         } else if (command.match(/no|n/i)) {
//           terminal.pop();
//           askRecipe(recipeArray, terminal, stepIndex + 1);
//         } else {
//           terminal.echo("\nPlease answer 'yes' or 'no'.");
//         }
//       },
//       {
//         prompt: "\nDo you have any questions about this step? (y/n) ",
//         greetings: "",
//       }
//     );
//   } else {
//     terminal.echo("\nYou've completed all the steps of the recipe!");
//     terminal.pop();
//   }
// }

// // ---------- AI ---------- //
// // ---------- AI ---------- //
// // ---------- AI ---------- //
// // ---------- AI ---------- //
// // ---------- AI ---------- //

// async function requestAI(input) {
//   const response = await fetch("/aiRequest", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ input: input, max_tokens: 1000 }),
//   });

//   if (response.ok) {
//     const jsonData = await response.json();

//     console.log("--AI DONE");
//     // console.log(jsonData.ai);
//     return jsonData.ai;
//   } else {
//     console.error("Error in submitting data.");
//     return "Error in submitting data.";
//   }
// }
