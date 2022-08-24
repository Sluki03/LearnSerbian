var input = document.getElementById("answer");

function Check() {
    var id = document.getElementById("answer").value.toLowerCase();
    var answer = id;
    
    var correct = new Audio('../../../sfx/correct.mp3');
    var wrong = new Audio('../../../sfx/wrong.mp3');

    var correctAnswer = "dobro veče";

    if(answer == correctAnswer) {
        document.getElementById("answer").style.borderColor = "green";
        document.getElementById("panelMessage").innerText = "Your answer is correct.";
        document.getElementById("panel").style.backgroundColor = "rgb(0, 70, 0)";
        correct.play();
    }
    else {
        document.getElementById("answer").style.borderColor = "red";
        document.getElementById("panelMessage").innerText = "Your answer is wrong. The correct answer is: " + correctAnswer + ".";
        document.getElementById("panel").style.backgroundColor = "rgb(70, 0, 0)";
        wrong.play();
    }

    if(document.getElementById("panelButton").innerText=="Continue")
        window.location.href = "../4/exercise.html";

    if(id == 0)
        document.getElementById("panelMessage").innerText = "You left a field empty.";
    else {
        document.getElementById("panelButton").innerText="Continue";
    }
}