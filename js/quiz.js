const answers = document.querySelectorAll(".answers .answer");
const nextElem = document.querySelector(".next");
const questionsCount = document.querySelector("#questions-count");
let currentUser = "";

if (localStorage.getItem("user")) {
  currentUser = localStorage.getItem("user");
}

let questions = [];
let currentIndex = 2;
let correctAnswers = 0;
//

answers.forEach((answer) => {
  answer.onclick = () => {
    answers.forEach((answer) => answer.classList.remove("checked"));
    answer.classList.add("checked");
  };
});

function fetchQuestions() {
  const request = new XMLHttpRequest();
  request.open("GET", "../questions.json", true);
  request.send();

  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status === 200) {
      questions = JSON.parse(request.responseText);
      console.log(request.responseText);
    }
  };
}

fetchQuestions();

function generateQuestion(id) {
  let question = questions.find((q) => q.id == id);

  let questionElem = document.querySelector(".title");
  questionElem.innerHTML = question.question;

  let questionImage = document.querySelector(".image img");
  questionImage.src = question.image_url;

  if (answers) {
    answers[0].innerHTML = question.answer_1;
    answers[1].innerHTML = question.answer_2;
    answers[2].innerHTML = question.answer_3;
    answers[3].innerHTML = question.answer_4;
  }
}

function checkAnswer(id) {
  let question = questions.find((q) => q.id == id);
  let correct = false;
  answers.forEach((answer) => {
    if (answer.classList.contains("checked")) {
      let dataIndex = answer.dataset.index;
      console.log(question);
      if (dataIndex.toString() == question.correct_answer) {
        correct = true;
      }
    }
  });
  return correct;
}

// let counter = 5000;

// function next() {
//   //   generateQuestion(currentIndex);
//   let timer = document.querySelector(".timer");
//   let interval = setInterval(() => {
//     timer.innerHTML = counter / 1000;
//     counter -= 1000;
//     if (counter == 0) {
//       clearInterval(interval);
//       generateQuestion(currentIndex);
//       currentIndex += 1;
//     }
//   }, 1000);
// }

let timer = document.querySelector(".timer");

nextElem.onclick = () => {
  if (currentIndex > questions.length) {
    nextElem.setAttribute("disabled", "disabled");
    storeData();
    location.href = "scorboard.html";
  } else {
    if (checkAnswer(currentIndex)) {
      correctAnswers++;
    }

    generateQuestion(currentIndex);
    const answerCountElem = document.querySelector("#answers-count");
    questionsCount.innerHTML = questions.length;
    answerCountElem.innerHTML = currentIndex;
    currentIndex++;
  }
};

function storeData() {
  let users = [];
  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.push({ name: currentUser, score: correctAnswers });
  localStorage.setItem("users", JSON.stringify(users));
}
