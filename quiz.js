// Load the CSV file and parse it into a JavaScript object
Papa.parse("questions.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    var questions = results.data;
    var totalQuestions = questions.length;

    // Display the questions on the webpage
    var quizContainer = document.getElementById("quiz-container");
    var submitButton = document.getElementById("submit-button");

   function showQuestions() {
    var output = [];
    for(var i=0; i<questions.length; i++) {
      output.push(
        '<div class="question-box">' +
        '<div class="question">' + (i+1) + '. ' + questions[i].question + '</div>' +
        '<div class="options">' +
          '<label><input type="radio" name="question' + i + '" value="A">' + questions[i].optionA + '</label>' +
          '<label><input type="radio" name="question' + i + '" value="B">' + questions[i].optionB + '</label>' +
          '<label><input type="radio" name="question' + i + '" value="C">' + questions[i].optionC + '</label>' +
          '<label><input type="radio" name="question' + i + '" value="D">' + questions[i].optionD + '</label>' +
        '</div>' +
        '</div>'
        );
      }  
      quizContainer.innerHTML = output.join('');
}

    showQuestions();

    // Collect the user's answers and calculate the score
    function getScore() {
      var score = 0;
      var answers = [];
      for(var i=0; i<questions.length; i++) {
        var selectedOption = quizContainer.querySelector('input[name="question' + i + '"]:checked');
        if(selectedOption) {
          answers.push(selectedOption.value);
          if(selectedOption.value === questions[i].answer) {
            score++;
          }
        }
      }
      return [score, answers];
    }

    // Show the user's score and correct answers
    function showResults() {
      var nomDisplay = document.getElementById("nom");
      var prenomDisplay = document.getElementById("prenom");
      var scoreDisplay = document.getElementById("score");
      var results = getScore();
      var score = results[0];
      var answers = results[1];
      scoreDisplay.innerHTML = "Vous avez " + score + " bonnes réponses sur " + totalQuestions + ".";

      for(var i=0; i<questions.length; i++) {
        var questionContainer = quizContainer.querySelectorAll('.question')[i];
        var answerContainer = document.createElement('div');
        if(answers[i] === questions[i].answer) {
          answerContainer.innerHTML = "Votre réponse: " + answers[i];
        } else {
          answerContainer.innerHTML = "Votre réponse: " + answers[i] + ". Réponse correcte: " + questions[i].answer;
        }
        questionContainer.appendChild(answerContainer);
      }
      submitButton.style.display = 'none';
    }

    submitButton.addEventListener("click", showResults);
  }
});

  }
