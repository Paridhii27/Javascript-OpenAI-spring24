// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //

let recipeName = "tiramisu";

let term;

let quizs;
let quizArray;

let recipeArray;

$(document).ready(function () {
  term = $("#commandDiv").terminal(
    {
      quiz: async function () {
        // this.echo("--quiz Start!");
        await generateQuiz();

        askQuiz(quizArray, this, 0);
      },
      recipe: async function () {
        await generateRecipe();

        askRecipe(recipeArray, this, 0);
      },
    },
    {
      greetings: "",
    }
  );
  // term.exec("recipe"); //DEBUG PURPOSE!
});

async function generateRecipe() {
  const recipeGeneratePrompt = `
Based on this recipe ${recipeName}, 
Please list out the 5 steps to complete this recipe.
ONLY output the steps,
DO NOT output anything else`;

  const recipeList = await requestAI(recipeGeneratePrompt);

  recipeArray = recipeList.split("\n").filter((line) => line.trim() !== "");

  // console.log(recipeArray);
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
        This is the question: ${currentQuiz}, and the input is ${command}, 
        please explain in ONLY one sentence why the user is right or wrong`;

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
    terminal.echo(`\nStep ${currentStep}`);
    terminal.push(
      function (command) {
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
    body: JSON.stringify({ input: input }),
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

function sendInput() {
  var input = document.getElementById("user_input").value; // Get user input
  // term.echo(`\nYou:`)
  term.exec(input); // Execute the input as a terminal command
  document.getElementById("user_input").value = ""; // Clear input
}
