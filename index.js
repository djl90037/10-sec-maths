$(document).ready(function () {

  var timeLeft = 10;
  var interval;
  var score = 0;
  var highScore = 0;
  var num1;
  var num2;
  var question = {};
  var checkbox10 = $('#max10');
  var checkbox25 = $('#max25');
  var checkbox50 = $('#max50');

  // disabling other checkboxes when one is checked
  $('input[type="checkbox"]').click(function () {
    $('input[type="checkbox"]').not(this).prop("checked", false);
  });

  // number and question generators
  var randomNumberGenerator = function (size) {
    return Math.ceil(Math.random() * size);
  }
  var max10 = function () {
    num1 = randomNumberGenerator(10);
    num2 = randomNumberGenerator(10);
  }

  var max25 = function () {
    num1 = randomNumberGenerator(25);
    num2 = randomNumberGenerator(25);
  }

  var max50 = function () {
    num1 = randomNumberGenerator(50);
    num2 = randomNumberGenerator(50);
  }

  // checkbox selected by user
  var gameMode = function () {
    $('input').change(function () {
      if (checkbox10.is(':checked')) {
        max10();
        newQuestionString();
      } else if (checkbox25.is(':checked')) {
        max25();
        newQuestionString();
      } else if (checkbox50.is(':checked')) {
        max50();
        newQuestionString();
      } else {
        location.reload();
      }
    })
    return question;
  }


  var newQuestionString = function () {
    question.answer = num1 + num2;
    question.equation = String(num1) + "+" + String(num2);
    $('#equation').text(question.equation);
  }


  var renderNewQuestion = function () {
    gameMode();
    console.log(timeLeft);
    if (checkbox10.is(':checked') && $('#time-left') !== 0) {
      max10();
      newQuestionString();
      checkbox25.attr('disabled', true); // disabling other gameModes while clock is running
      checkbox50.attr('disabled', true);
    }
    if (checkbox25.is(':checked') && $('#time-left') !== 0) {
      max25();
      newQuestionString();
      checkbox10.attr('disabled', true);
      checkbox50.attr('disabled', true);

    }
    if (checkbox50.is(':checked') && $('#time-left') !== 0) {
      max50();
      newQuestionString();
      checkbox10.attr('disabled', true);
      checkbox25.attr('disabled', true);
    }
  }

  var checkAnswer = function (userInput, answer) {
    if (userInput === answer) {
      renderNewQuestion();
      $('#user-input').val('');
      updateTimeLeft(+1);
      updateScore(+1);
      if (score > highScore) {
        updateHighScore();
      }
    }
  }

  renderNewQuestion();

  var updateTimeLeft = function (amount) {
    timeLeft += amount;
    $('#time-left').text(timeLeft);
  }

  var updateScore = function (amount) {
    score += amount;
    $('#score').text(score);
  }

  var updateHighScore = function () {
    highScore = score;
    $('#high-score').text(score);
  }

  var startGame = function () {
    if (!interval) {
      if (timeLeft === 0) {
        updateTimeLeft(10);
        updateScore(-score);
      }
      interval = setInterval(function () {
        updateTimeLeft(-1);
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = undefined;
          $('#timer-id').html('<span style="color: red">Game Over!</span>')
          $('#user-input').prop('disabled', true);

          if (score > highScore) {
            updateHighScore();
          } else {
            $('#high-score').text(highScore);
          }
        }
      }, 1000)
      resetClock();
    }
  }

  var startGameFunction = function () {
    $('#user-input').on('keyup', function () {
      startGame();
      let currentQuestion = gameMode();
      checkAnswer(Number($(this).val()), currentQuestion.answer);
    })
  }

  var resetClock = function () {
    $('#reset').on('click', function () {
      if (timeLeft === 0) {
        $('#user-input').prop('disabled', false);
        $('#timer-id').html('seconds left')
        updateTimeLeft(10);
        updateScore(-score);
        renderNewQuestion();
        startGameFunction();
        $('input:checkbox').attr('disabled', false);
      }
    })
  }
  startGameFunction();
})


