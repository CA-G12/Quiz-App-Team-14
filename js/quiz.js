const answers = document.querySelectorAll(".answers .answer");
answers.forEach((answer) => {
  answer.onclick = () => {
    answers.forEach((answer) => answer.classList.remove("checked"));
    answer.classList.add("checked");
  };
});
