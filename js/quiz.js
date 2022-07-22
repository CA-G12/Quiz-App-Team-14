const answers = document.querySelectorAll(".answers .answer");
const nextElem = document.querySelector(".next");
const questionsCount = document.querySelector("#questions-count");
let timer = document.querySelector(".timer");
const QUESTION_TIME = 20000;

let currentUser = "";
let questions = [];
let currentIndex = 0;
let correctAnswers = 0;
let counter = QUESTION_TIME;

// I need them to be global variables for the animation to work.

let questionImage = document.querySelector(".image img");
let questionElem = document.querySelector(".title-text");
const answerstext = document.querySelectorAll(".answers .answer .answer-text");

fetchQuestions();

window.onload = () => {
  console.log(questions);
  if (questions.length > 0) {
    questions = shuffleArray(questions);
    nextQuestion();
    coundDown();
    if (localStorage.getItem("user")) {
      currentUser = localStorage.getItem("user");
      document.querySelector(".nickname").innerHTML = `NickName: <span>${currentUser}</span>`;
    }

    answers.forEach((answer) => {
      answer.onclick = () => {
        answers.forEach((answer) => answer.classList.remove("checked"));
        answer.classList.add("checked");
        nextElem.removeAttribute("disabled");
      };
    });
  }
};

nextElem.onclick = () => {
  if (checkAnswer(currentIndex)) {
    correctAnswers = correctAnswers + 1;
  }
  currentIndex++;
  counter = QUESTION_TIME;
  nextQuestion();
};

function fetchQuestions() {
  const request = new XMLHttpRequest();
  request.open("GET", "../questions.json", true);
  request.send();

  request.onreadystatechange = () => {
    if (request.readyState == 4 && request.status === 200) {
      questions = JSON.parse(request.responseText);
    }
  };
}

function generateQuestion(id) {
  // Animated variables need to be declared globally to be used in my animations function.

  let question = questions[id];
  questionElem.innerHTML = question.question;
  questionImage.src = question.image_url;

  if (answers) {
    answerstext[0].innerHTML = question.answer_1;
    answerstext[1].innerHTML = question.answer_2;
    answerstext[2].innerHTML = question.answer_3;
    answerstext[3].innerHTML = question.answer_4;
  }
  document.querySelectorAll(".answer").forEach((elem) => elem.classList.remove("checked"));
}

function checkAnswer(id) {
  let question = questions[id];
  let answerChecked = document.querySelector(".answer.checked");
  if (answerChecked) {
    let dataIndex = answerChecked.dataset.index;
    return dataIndex == question.correct_answer;
  }
}

function coundDown() {
  let timer = document.querySelector(".timer");
  let interval = setInterval(() => {
    if (counter < 0) {
      if (checkAnswer(currentIndex)) {
        correctAnswers = correctAnswers + 1;
      }
      currentIndex++;
      nextQuestion(currentIndex);
      counter = QUESTION_TIME;
    }
    timer.innerHTML = counter / 1000;
    counter -= 1000;
  }, 1000);
}

function nextQuestion() {
  animation();

  if (currentIndex >= questions.length) {
    storeData();
    location.href = "scorboard.html";
  } else {
    generateQuestion(currentIndex);

    const answerCountElem = document.querySelector("#answers-count");
    questionsCount.innerHTML = questions.length;
    answerCountElem.innerHTML = currentIndex + 1;
    nextElem.setAttribute("disabled", "disabled");
  }
}

function storeData() {
  let users = [];
  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.push({ name: currentUser, score: correctAnswers });
  localStorage.setItem("users", JSON.stringify(users));
}

function animation() {
  questionImage.classList.add("animation");
  questionElem.classList.add("animation");
  document.querySelectorAll(".answer-text").forEach((elem) => elem.classList.add("animation"));

  setTimeout(() => {
    questionImage.classList.remove("animation");
    questionElem.classList.remove("animation");
    answerstext.forEach((elem) => elem.classList.remove("animation"));
  }, 800);
}

function shuffleArray(arr) {
  let newArr = [];
  while (true) {
    let rand = Math.floor(Math.random() * arr.length);
    if (!newArr.includes(arr[rand])) {
      newArr.push(arr[rand]);
    }

    if (newArr.length == arr.length) {
      return newArr;
    }
  }
}
