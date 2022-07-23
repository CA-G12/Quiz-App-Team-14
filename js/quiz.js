const answersElems = document.querySelectorAll(".answers .answer");
const nextElem = document.querySelector(".next");
const questionsCountElem = document.querySelector("#questions-count");
let timerElem = document.querySelector(".timer");
const QUESTION_TIME = 20000;

let currentUser = "";
let questions = [];
let currentIndex = 0;
let correctAnswers = 0;
let counter = QUESTION_TIME;

// I need them to be global variables for the animation to work.

let questionImageElem = document.querySelector(".image img");
let questionElem = document.querySelector(".title-text");
const answerTextElems = document.querySelectorAll(".answers .answer .answer-text");

// Music
const backgroundMusicElem = document.getElementById("music");

fetchQuestions();
startmusic();

window.onload = () => {
  if (questions.length > 0) {
    questions = shuffleArray(questions);
    nextQuestion();
    coundDown();
    if (localStorage.getItem("user")) {
      currentUser = localStorage.getItem("user");
      document.querySelector(".nickname").innerHTML = `NickName: <span>${currentUser}</span>`;
    }

    answersElems.forEach((answerElem) => {
      answerElem.onclick = () => {
        answersElems.forEach((ele) => ele.classList.remove("checked"));
        answerElem.classList.add("checked");
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

function nextQuestion() {
  animation();

  if (currentIndex >= questions.length) {
    storeResults();
    stopmusic();
    localStorage.setItem("finalScore", correctAnswers);

    location.href = "scorboard.html";
  } else {
    previewQuestionHTML(currentIndex);

    const answerCountElem = document.querySelector("#answers-count");
    questionsCountElem.innerHTML = questions.length;
    answerCountElem.innerHTML = currentIndex + 1;
    nextElem.setAttribute("disabled", "disabled");
  }
}

function previewQuestionHTML(index) {
  // Animated variables need to be declared globally to be used in my animations function.

  let question = questions[index];
  questionElem.innerHTML = question.question;
  questionImageElem.src = question.image_url;

  if (answersElems) {
    answerTextElems[0].innerHTML = question.answer_1;
    answerTextElems[1].innerHTML = question.answer_2;
    answerTextElems[2].innerHTML = question.answer_3;
    answerTextElems[3].innerHTML = question.answer_4;
  }
  document.querySelectorAll(".answer").forEach((answerElem) => answerElem.classList.remove("checked"));
}

function checkAnswer(index) {
  let question = questions[index];
  let checkedAnswerElem = document.querySelector(".answer.checked .answer-text");
  if (checkedAnswerElem) {
    let dataIndex = checkedAnswerElem.dataset.index;
    return dataIndex == question.correct_answer;
  }
}

function coundDown() {
  setInterval(() => {
    if (counter < 0) {
      if (checkAnswer(currentIndex)) {
        correctAnswers = correctAnswers + 1;
      }
      currentIndex++;
      nextQuestion(currentIndex);
      counter = QUESTION_TIME;
    }
    timerElem.innerHTML = counter / 1000;
    counter -= 1000;
  }, 1000);
}

function storeResults() {
  let users = [];
  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.push({ name: currentUser, score: correctAnswers });
  localStorage.setItem("users", JSON.stringify(users));
}

function animation() {
  questionImageElem.classList.add("animation");
  questionElem.classList.add("animation");
  document.querySelectorAll(".answer-text").forEach((elem) => elem.classList.add("animation"));

  setTimeout(() => {
    questionImageElem.classList.remove("animation");
    questionElem.classList.remove("animation");
    answerTextElems.forEach((elem) => elem.classList.remove("animation"));
  }, 800);
}

function startmusic() {
  backgroundMusicElem.play();
}

function stopmusic() {
  backgroundMusicElem.pause();
  backgroundMusicElem.currentTime = 0;
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
