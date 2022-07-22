const answers = document.querySelectorAll(".answers .answer");
const nextElem = document.querySelector(".next");
const questionsCount = document.querySelector("#questions-count");
let timer = document.querySelector(".timer");
const QUESTION_TIME = 20000;

let currentUser = "";
let questions = [];
let currentIndex = 1;
let correctAnswers = 0;
let counter = QUESTION_TIME;

fetchQuestions();

window.onload = () => {
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
    };
  });
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
  document.querySelectorAll(".answer").forEach((elem) => elem.classList.remove("checked"));
}

function checkAnswer(id) {
  let question = questions.find((q) => q.id == id);
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
  if (currentIndex > questions.length) {
    storeData();
    location.href = "scorboard.html";
  } else {
    generateQuestion(currentIndex);

    const answerCountElem = document.querySelector("#answers-count");
    questionsCount.innerHTML = questions.length;
    answerCountElem.innerHTML = currentIndex;
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
