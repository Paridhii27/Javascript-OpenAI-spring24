// console.log(hello("paridhi"));

// const name = prompt("What is your name?")
// console.log(`Hello ${name}`)

// function getRandomInt(max) {
//    return Math.floor(Math.random() * max)+1;
// }

// console.log("A random number between 1 and 6 (inclusive) is", getRandomInt(6))

// const numOne = prompt("Enter a number");
// const numTwo = prompt("Enter another number");
// const sumNum = parseFloat(numOne) + parseFloat(numTwo)
// console.log(`The sum of the numbers ${numOne} and ${numTwo} is ${sumNum}`)

// const randomNum = Math.random()

// const firstName = prompt("Enter your first name:");
// const lastName = prompt("Enter your last name:");

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// if (getRandomInt(2)==0){
//   console.log(`${firstName}`)
// }
// else{
//   console.log(`${lastName}`)
// }

// const amountUSD = prompt("Enter amount in USD:")
// const currency = prompt("Which currency do you want to choose:")
// const amountINR = parseFloat(amountUSD) * 83
// const amountEuro = parseFloat(amountUSD) * 0.93
// const amountFranc = parseFloat(amountUSD) * 0.87
// const amountSGD = parseFloat(amountUSD) * 1.34
// const amountPound = parseFloat(amountUSD) * 0.79
// const amountYen = parseFloat(amountUSD) * 148.38
// if (currency== "INR"){
//   console.log(`The amount converted to INR is ${amountINR}`)
// }
// else if (currency== "Euro"){
//   console.log(`The amount converted to Euro is ${amountEuro}`)
// }
// else if (currency== "Franc"){
//   console.log(`The amount converted to Swiss Franc is ${amountFranc}`)
// }
// else if (currency== "SGD"){
//   console.log(`The amount converted to Singapore Dollar is ${amountSGD}`)
// }
// else if (currency== "Pounds"){
//   console.log(`The amount converted to Pounds is ${amountPound}`)
// }
// else if (currency== "Yen"){
//   console.log(`The amount converted to Japanese Yen is ${amountYen}`)
// }
// else{
//   console.log(`The chosen currency wasn't found`)
// }
// console.log(`The amount converted to INR is ${amountINR}`)
// console.log(`The amount converted to Euro is ${amountEuro}`)
// console.log(`The amount converted to Swiss Franc is ${amountFranc}`)
// console.log(`The amount converted to Singapore Dollar is ${amountSGD}`)
// console.log(`The amount converted to Pounds is ${amountPound}`)
// console.log(`The amount converted to Japanese Yen is ${amountYen}`)


// const temp = prompt("What is the temperature(F): ")
// const tempF = parseInt(temp)
// if (tempF<60 && tempF>0){
//   console.log("The weather is cold")
// }
// else if (tempF>=60 && tempF<75){
//   console.log("The weather is warm")
// }
// else if (tempF>=75 && tempF<110){
//   console.log("The weather is hot")
// }
// else{
//   console.log("The weather is extreme and does not fall under the given categories")
// }

// let score = 0
// const ques1 = prompt("How many Oscars did Titanic win?\n a) 8 \n b)11 \n c)13 \n")
// if(ques1 == "b" || ques1 == "B" || ques1 == 11){
//    score++;
// }
// const ques2 = prompt("What is the name of the alien in the movie E.T.?\n a) Zrek \n b)Shrek \n c)Exir \n")
// if(ques2 == "a" || ques2 == "A" || ques2 == "Zrek"){
//    score++;
// }
// const ques3 = prompt("What color is the sunset on Mars?\n a) Green \n b)Blue \n c)Red \n")
// if(ques3 == "b" || ques3 == "B" || ques3 == "Blue"){
//    score++;
// }
// console.log("The score is ", score)
// const mcq = [
//    {
//      question: "How many Oscars did Titanic win?",
//      answers: {
//        a: 8,
//        b: 11,
//        c: 13
//      },
//      correctAnswer: "b"
//    },
//    {
//      question: "What is the name of the alien in the movie E.T.?",
//      answers: {
//       a: "Zrek",
//       b: "Shrek",
//       c: "Exir",
//      },
//      correctAnswer: "a"
//    },
//    {
//      question: "What color is the sunset on Mars?",
//      answers: {
//        a: "Green",
//        b: "Blue",
//        c: "Red",
//      },  
//      correctAnswer: "b"
//    }
//  ];

console.log("%cHello World", "color: red");
console.log("%cHello World", "background-color: blue");
console.log("%cHello World", "text-decoration: line-through");

console.log("%cParidhi", "color: rgb(0,90,30)");