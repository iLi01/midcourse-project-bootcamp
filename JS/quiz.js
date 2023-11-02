//  variables to link too document elements
const questionDisplay = document.getElementById('question');
const score = document.getElementById('correct-score');
const total = document.getElementById('total-question');
const options = document.querySelector('.quiz-options');
const showResult = document.getElementById('result')
const checkBtn = document.getElementById('check-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const scoreContainer = document.getElementById('score-container');


let correctAns = "", correctScore = askedCount = 0, totalQuestion = 5;

// added an event listeners to the buttons to carry out task onced clicked.
const eventListeners = () => {
    checkBtn.addEventListener('click', checkAnswer);
    playAgainBtn.addEventListener('click', restartQuiz)
}

// once the DOM loades it will carry out these set of function and have defult for the score
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    score.textContent = correctScore;
    total.textContent = totalQuestion;
});

// create an API function to fetch the data
const loadQuestion = async () => {
    const url = 'https://the-trivia-api.com/api/questions?categories=food_and_drink&limit=1&difficulty=easy&tags=drinking,drink';
    const result = await fetch(url);
    const data = await result.json();
    //console.log(data[0].question);
    showResult.innerHTML = ''
    showQuestion(data[0])
}

// show question and option on the DOM and make sure that each time the position of the answer changes once loaded.
const showQuestion = (data) => {
    checkBtn.disabled = false;
    correctAns = data.correctAnswer;
    let incorrectAns = data.incorrectAnswers;
    let optionList = incorrectAns;
    optionList.splice(Math.floor(Math.random() * (incorrectAns.length + 1)), 0, correctAns);
    
    questionDisplay.innerHTML = `${data.question}`;
    options.innerHTML = `${optionList.map((option, indec) => `<li> ${option} </li>`).join('')}`;

    selectOption();
}

//once the option is selected it will changes tha background of all the list when clicked
const selectOption = () => {
    options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(options.querySelector('.selected')){
                const activeOption = options.querySelector('.selected');
                activeOption.classList.remove('selected')
            }
            option.classList.add('selected')
        });
    });
}

// shows answer and results if you are right or wrong also keep track of the scores
// and added a parameter is click on 'Check Anwser' and not clicked on a option.
const checkAnswer = () => {
    checkBtn.diabled = true;
    if(options.querySelector('.selected')){
        let selectedAnswer = options.querySelector('.selected').textContent;
        if (selectedAnswer.trim() == HTMLDecode(correctAns)) {
            correctScore++;
            showResult.innerHTML = `<p class='quiz-center'>✅Correct✅</p>`
        } else {
            showResult.innerHTML = `<p class='quiz-center'>❌Incorrect❌</p> <br> <p class='quiz-center'>Correct Answer is ${correctAns}</p>`
        }
        checkCount();
    }else{
        showResult.innerHTML = `<p class='quiz-center'>❓ Pleace select an answer? ❓</p>`;
        checkBtn.disabled = false
    }
}

// keep track on score and display 'Play Again' button when ended
const checkCount = () => {
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        showResult.innerHTML = `<p class='quiz-center'> Your score is ${correctScore} out of ${totalQuestion}</p>`
        playAgainBtn.style.display = 'block';
        checkBtn.style.display = 'none';
        questionDisplay.style.display = 'none';
        options.style.display = 'none';
        scoreContainer.style.display = 'none';
    } else{
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

// setting the score to defult
const setCount = () => {
    total.textContent =  totalQuestion;
    score.textContent = correctScore;
}

// when showing result i used backtick with html elements. this function convert strings to DOM documents
const HTMLDecode = (textString) => {
    let doc = new DOMParser().parseFromString(textString, 'text/html');
    return doc.documentElement.textContent;
}

//restrating the quiz.
const restartQuiz = () => {
    correctScore = 0;
    playAgainBtn.style.display = 'none';
    checkBtn.style.display = 'block';
    questionDisplay.style.display = 'block';
    options.style.display = 'block';
    scoreContainer.style.display = 'flex';
    checkBtn.display = false;
    setCount();
    loadQuestion()
}