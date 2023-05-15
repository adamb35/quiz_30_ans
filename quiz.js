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
          '<div class="question">' + questions[i].question + '</div>' +
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
      var scoreDisplay = document.getElementById("score");
      var results = getScore();
      var score = results[0];
      var scoreData = JSON.stringify(score);
      var answers = results[1];
      
     // Send a POST request to the Google Apps Script web app URL
  fetch('https://script.google.com/macros/s/AKfycbz51sUYdeIy9sG4katAiEDwMz2WVELghr9t-z1LgAw6jv9CxjQAVwbs3O_zSyiOl3Q/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: scoreData
  })
  .then(function(response) {
    // Handle the response if needed
    console.log('Results sent successfully!');
  })
  .catch(function(error) {
    // Handle any errors that occur during the request
    console.error('Error sending results:', error);
  });
      scoreDisplay.innerHTML = "You scored " + score + " out of " + totalQuestions + ".";

      for(var i=0; i<questions.length; i++) {
        var questionContainer = quizContainer.querySelectorAll('.question')[i];
        var answerContainer = document.createElement('div');
        if(answers[i] === questions[i].answer) {
          answerContainer.innerHTML = "Your answer: " + answers[i];
        } else {
          answerContainer.innerHTML = "Your answer: " + answers[i] + ". Correct answer: " + questions[i].answer;
        }
        questionContainer.appendChild(answerContainer);
      }
      submitButton.style.display = 'none';
    }

    submitButton.addEventListener("click", showResults);
  }
});
