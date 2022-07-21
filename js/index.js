let newUserInputBox = document.getElementById('nickname');
let howtoplaybutton = document.getElementById('howtoplay');
let xbutton = document.getElementById('xbutton');

function start() {
    if (!newUserInputBox.value) {
        alert('Nickname is required.');
    } else {
        localStorage.setItem('user',newUserInputBox.value);
    }
}

function openhowtoplay() {
    howtoplaybutton.style.display = "flex";
}

function closehowtoplay() {
    howtoplaybutton.style.display = "none";
}