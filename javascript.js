const questions = [//questions est un tableau d’objets, chaque objet représentant une question.
    {
        question: "Devinez quel est l'animal le plus gros du monde",//question: le texte de la question.
        answers: [//answers: un tableau de réponses possibles, où chaque réponse a 
            { text: "Shark", correct: false },//text: le texte de la répons
            { text: "Blue whale", correct: true },//correct: un booléen indiquant si cette réponse est correcte ou non.
            { text: "Elephant", correct: false },
            { text: "Giraffe", correct: false },
        ]
    },
    {
        question: "Devinez quel est l'animal le plus rapide du monde",
        answers: [
            { text: "Cheetah", correct: true },
            { text: "Horse", correct: false },
            { text: "Eagle", correct: false },
            { text: "Kangaroo", correct: false },
        ]
    },
    {
        question: "Quel est le plus grand mammifère terrestre?",
        answers: [
            { text: "Giraffe", correct: false },
            { text: "Blue whale", correct: false },
            { text: "Elephant", correct: true },
            { text: "Shark", correct: false },
        ]
    },
];

const questionElement = document.getElementById("question");//questionElement: affiche le texte de la question.
const answerButton = document.getElementById("answer-buttons");//answerButton: contient les boutons de réponse pour chaque question
const nextButton = document.getElementById("next-btn");//nextButton: un bouton pour passer à la question suivante.

let currentQuestionIndex = 0;//currentQuestionIndex garde une trace de la question en cours.
let score = 0;//score enregistre le nombre de bonnes réponses de l'utilisateur.

function startQuiz() {//Cette fonction initialise le quiz en remettant currentQuestionIndex et score à 0 et affiche la première question en appelant showQuestion().
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Suivant";
    showQuestion();
}

function showQuestion() {//showQuestion affiche la question et les réponses :
    resetState();//resetState(): efface les anciennes réponses.
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;//Récupère la question en cours, puis l’affiche.
    
    shuffleArray(currentQuestion.answers).forEach(answer => {//Mélange les réponses avec shuffleArray et crée un bouton pour chaque réponse.
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if (answer.correct) {//Si une réponse est correcte, elle est marquée avec un attribut dataset.correct = true.
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);//Les boutons de réponse appellent selectAnswer() quand ils sont cliqués.
    });
}

function resetState() {
    nextButton.style.display = "none";//resetState cache le bouton "Suivant" et supprime toutes les réponses précédentes, préparant ainsi l'affichage pour la prochaine question.
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e) {//selectAnswer est appelée quand l'utilisateur clique sur une réponse 
    const selectedBtn = e.target;//e.target récupère l'élément HTML (le bouton) sur lequel l'utilisateur a cliqué, et on le stocke dans selectedBtn
    const isCorrect = selectedBtn.dataset.correct === "true";//Elle vérifie si la réponse est correcte via selectedBtn.dataset.correct
    if (isCorrect) {//Si isCorrect est vrai, le bouton cliqué reçoit la classe CSS 'correct', ce qui applique un style visuel 
        selectedBtn.classList.add('correct');
        score++;//augmente le score de l'utilisateur.
    } else {
        selectedBtn.classList.add('incorrect');//Sinon, le bouton cliqué reçoit la classe CSS 'incorrect'
    }
    Array.from(answerButton.children).forEach(button => {//Array.from(answerButton.children) transforme la liste des boutons enfants de answerButton en un tableau, ce qui permet d'utiliser forEach pour les parcourir.
        if (button.dataset.correct === "true") {//Pour chaque bouton, s'il possède data-correct="true", la classe 'correct' lui est ajoutée. Ainsi, même si l'utilisateur choisit une mauvaise réponse, la bonne réponse est indiquée en vert.
            button.classList.add("correct");
        }
        button.disabled = true;//Chaque bouton est ensuite désactivé (button.disabled = true) pour empêcher l'utilisateur de cliquer de nouveau sur une réponse.
    });
    nextButton.style.display = "block";//Une fois qu'une réponse a été sélectionnée, le bouton "Suivant" est affiché, permettant à l'utilisateur de passer à la question suivante.
}

function showScore() {//showScore réinitialise l'état et affiche le score total avec un message de feedback.
    resetState();
    questionElement.innerHTML = `Votre score : ${score} sur ${questions.length}! ${getFeedbackMessage()}`;
    nextButton.innerHTML = "Rejouer";//Elle change également le texte du bouton pour "Rejouer".
    nextButton.style.display = "block";
}

function handleNextButton() {//handleNextButton() gère la logique de passage à la question suivante dans le quiz. Elle vérifie si d'autres questions sont disponibles et affiche la prochaine question
    currentQuestionIndex++;//Cette ligne augmente la valeur de currentQuestionIndex de 1
    if (currentQuestionIndex < questions.length) {//si currentQuestionIndex et plus petit que questions.length alors la questions est montrée 
        showQuestion();
    } else {//sinon le Score est montrée 
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {//si currentQuestionIndex et plus petit que questions.length alors il appelle handleNextButton.
        handleNextButton();
    } else {//sinon le Quiz est relancée 
        startQuiz();
    }
});

function shuffleArray(array) {//La fonction shuffleArray(array) mélange aléatoirement les éléments d'un tableau en utilisant la méthode sort()
    return array.sort(() => Math.random() - 0.5);//Math.random() génère un nombre aléatoire entre 0 et 1.
}//n soustrayant 0.5, on obtient une valeur entre -0.5 et +0.5, ce qui détermine si les éléments doivent être échangés : une valeur négative indique que l'élément actuel devrait venir avant, une positive qu’il devrait venir après.

function getFeedbackMessage() {//etFeedbackMessage() génère un message de retour basé sur le score de l'utilisateur dans le quiz. 
    if (score === questions.length) {//si score est égal au nombre total de questions alors
        return "Excellent! Vous avez tout juste!";
    } else if (score > questions.length / 2) {//Si le score est supérieur à la moitié du nombre de questions (c’est-à-dire plus de la moitié des réponses correctes), la fonction retourne un message 
        return "Bon travail! Vous avez bien répondu à la plupart des questions.";
    } else {//si l'utilisateur n'a pas de bonne réponse alors le message est return
        return "Vous pouvez faire mieux! Réessayez pour améliorer votre score.";
    }
}

startQuiz();
