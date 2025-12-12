

// load words into dictionary
let dictionary= [];
fetch("/Puzzle-Game-V3/words.json")
    .then(res => res.json())
    .then(data => dictionary = data.words)
    .catch(err => console.error("Dictionary load failed:", err));


// list that will store the stats of each level in local storage
let stats = JSON.parse(localStorage.getItem("stats")) || {
    level1:{ attempts:"", word:"", time:"", success:"" },
    level2:{ attempts:"", word:"", time:"", success:"" },
    level3:{ attempts:"", word:"", time:"", success:"" }
};



// determine which difficulty is chosen
function difficulty(level) {
    
    // bag of words
    const easyWords = ['GIVES', 'GAMES', 'SORRY', 'WHICH', 'OFFER', 'MONEY', 'MEANT', 'TRADE', 'FRONT', 'BRAIN'];
    const mediumWords = ['BROAD', 'APART', 'ROMAN', 'SMILE', 'WASTE', 'IDEAS', 'ENTRY', 'ROYAL', 'CLOCK', 'OCCUR'];
    const hardWords = ['SHALE', 'AMPLY', 'FLAMS', 'HONKY', 'BEGOT', 'GNASH', 'DIKED', 'JUMBO', 'GARBS', 'GRAPY'];

    let words = [];
    
    if(level == 'easy') {

      // random word from the list for the game
        words = easyWords;
        

    }
    else if(level == 'medium'){
        // random word from the list for the game
        words = mediumWords;
        
    }
    else if(level == 'hard'){
        // random word from the list for the game
        words = hardWords; 

    }

    let toGuess = "";
    const random = Math.floor(Math.random()*words.length);
    toGuess = words[random];


    // store the word for the next page
    localStorage.setItem("wordToGuess", toGuess);

    // store level 
    localStorage.setItem("currentLevel", level);

    // go to the selected difficulty level
    if(level == 'easy') {
        window.location.href = "/Puzzle-Game-V3/Game/easyLevel.html";
        
    }
    else if(level == 'medium'){
        window.location.href = "/Puzzle-Game-V3/Game/mediumLevel.html";
    }
    else if(level == 'hard'){
        window.location.href = "/Puzzle-Game-V3/Game/hardLevel.html"; 
    }
}

// the actual game that verifies guesses and the coloring of the letters
function startGame(toGuess,level){

    // fetch the cells where the letters will be placed
    const cells = document.querySelectorAll('.item');
    let currRow= 0;
    let currCol=0;
    let count = 0;
    const wordLength = 5;

    // hidden timer
    let timeElapsed = 0;
    let timerInterval;
    function updateTimer(){
        timeElapsed++;
    }
    // start the timer
    timerInterval = setInterval(updateTimer, 1000);

    // keep track of pressed keys
    document.addEventListener("keydown", handleKey);

    // input handler
    function handleKey(e){

        // take pressed key and transform to upper case for easier comparison
        const key = e.key.toUpperCase();
        const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N',
            'O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        // verify if the pressed key in the keyboard is a letter and it is in the same row
        if(alphabet.includes(key)  && currCol < wordLength){
            // calculate the cell index out of 25
            const index = (currRow * wordLength) + currCol
            cells[index].textContent = key;
            // go to the next cell and wait for user input
            currCol++
        }
        // user wants to delete current letter 
        else if(e.key == "Backspace" && currCol>0){
            currCol--;
            const index= (currRow * wordLength) + currCol;
            cells[index].textContent = "";
        }
        // user wants to submit guess
        else if(e.key == "Enter" && currCol == wordLength){
            // call up checkGuessto verify the validity if the guess
            checkGuess();
        }
    }
    // takes the 5 letters and puts it together
    function checkGuess(){
        const guess = [];
        
        for(let i = 0 ; i< wordLength; i++){

            const index = (currRow * wordLength) + i;
            guess.push(cells[index].textContent);
        } 
        const guessedWord = guess.join("");  

        if(!dictionary.includes(guessedWord.toLowerCase())){
            showMessage("Not a real word!");
            return;
        }

        // after checking if the word is valid
        count ++;

        // function to see if guess is right or wrong 
        colorGuess(guessedWord);
        

        if(toGuess === guessedWord){

            // stop the timer
            clearInterval(timerInterval);
            // show stats 
            winStats(currRow+1,true);

            // stop further input
            document.removeEventListener("keydown", handleKey);

            return;
        }

        if(count == 5){
            // stop the timer
            clearInterval(timerInterval);
            // show stats 
            winStats(currRow+1,false);

            // stop further input
            document.removeEventListener("keydown", handleKey);
            count= 0;

            return;
        }

        currRow++;
        currCol=0;
    
    }

    function colorGuess(guessedWord){

        // map to keep track of the letters that have been checked
        const letters = new Map();

        // variables to calculate guess score
        let Gl = 0;
        let Ol = 0;


        // add the letters from the guess to letters as false because they have not been checked yet
        for(let j = 0; j<wordLength;j++){
            letters.set(guessedWord[j],false);
        }

        for(let i = 0; i < wordLength; i++){

            const index = (currRow * wordLength) + i;
            const letter = guessedWord[i];
            const key = document.getElementById(letter);
        
            // verify if the letter is in the word and right position
            if(letter == toGuess[i]){
                cells[index].style.backgroundColor = "green";
                cells[index].style.color = "white";
                key.style.background = "green";
                key.style.color= "white";
                // set the letter to true so that it does not get checked again 
                letters.set(letter,true);
                Gl++;
            }
            // verify if the letter is in the word but in the wrong position
            else if(toGuess.includes(letter)&& letters.get(letter)==false){
                cells[index].style.backgroundColor = "orange";
                cells[index].style.color = "white";
                letters.set(letter,true);
                // verify if the letter is not already green
                if(key.style.background != "green"){
                    key.style.background = "orange";
                    key.style.color= "white";
                }
                Ol++;
            }
            // word does not contain letter
            else{

                cells[index].style.backgroundColor = "red";
                cells[index].style.color = "white";
                //color the keyboard with gray if not green or orange already
                if(key.style.background != "orange" &&key.style.background != "green"){
                    key.style.background = "gray";
                    key.style.color= "white";
                }
                
            }
        }

        // bag of feedback
        const badGuess = ['Dont worry next guess will be better','Uff this word is hard!','Atleast you know these letters are not it','You can do better, I know it!'];
        const okeyGuess = ['Not bad! keep going','That is already good','This makes it easier!','This certainly helps'];
        const goodGuess = ['Is the next guess it?','Wow! so close..','Good you are almost there!','You are getting the hang of it'];

        // choose which message to show as
        // formula :[(( (Gl x 2) + (Ol x 1) )/maxBaseScore) x 80] + [(maxGuesses - currGuess + 1 /currGuess) x 20 ]
        // correct guess Gl * 2 = 10 
        const maxBaseScore= 10;
        let baseScore = (Gl*2) + (Ol*1);

        // left side of formula
        let score = (baseScore/maxBaseScore) * 80;

        // right side of formula
        let currGuess = currRow + 1 ;
        let guessScore = ((5 - currGuess + 1 ) / 5) * 20;

        // final score
        let finalScore = score + guessScore;
        let formula = Math.round(Math.max(1, Math.min(100, finalScore)));
        
        // feedback choice
        let feedbackList = [];

        if(formula <= 33 ){
            feedbackList = badGuess;
        }
        else if(formula <= 66){
            feedbackList = okeyGuess;
        }
        else{
            feedbackList = goodGuess;
        }

        // random index
        const feedbackIndex = Math.floor(Math.random()*feedbackList.length);
        const feedback = feedbackList[feedbackIndex];

        // feedback voice output for each guess
        if ('speechSynthesis' in window && baseScore !=10) {
                const utterance = new SpeechSynthesisUtterance(feedback);
                utterance.lang = 'en-US'; // language
                utterance.rate = 1;       // speed (0.1–10)
                utterance.pitch = 1;      // pitch (0–2)
                window.speechSynthesis.speak(utterance);
            } 
        
       
    }


    // make pop up visible and display stats
    function winStats(attempts, success){

        const min = Math.floor(timeElapsed / 60);
        const sec = timeElapsed % 60;
        const minutes = min.toString().padStart(2,'0');
        const seconds = sec.toString().padStart(2,'0');
        const time = minutes+":"+ seconds;

        // save variables for end stats
        localStorage.setItem("time",time);
        localStorage.setItem("attempts", attempts);
        localStorage.setItem("success", success);

        storeStats(level);

        document.getElementById("attemptedGuesses").innerText = attempts + "/5 guesses";
        document.getElementById("correctWord").innerText += "The word was "+ toGuess;
        document.getElementById("levelCompleted").innerText += "The current level is "+ level;
        document.getElementById("timer").innerText += "Time taken: " + time;
        document.getElementById("success").innerText += "Success: " + success; 
        const popup = document.getElementById("popup");
            // make the pop up visible
            popup.style.visibility='visible';
    }


    //close the pop up with the stats
    const closeButton = document.getElementById("close");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            document.getElementById("popup").style.visibility='hidden';
            window.location.href = "/Puzzle-Game-V3/Difficulty/difficultyPage.html";
            levelCompleted(level);
        });
    }

    
    function levelCompleted(lvl){

        // after completing level 1 enable level 2
        if(lvl == 'easy'){
            localStorage.setItem("enableMedium", "true");
        }
        else if(lvl == 'medium'){
            localStorage.setItem("enableHard", "true");
        }
    }
    // functiom to store the stats of each level
    function storeStats(currLevel){

        const attempts = localStorage.getItem("attempts");
        const time = localStorage.getItem("time");
        const success = localStorage.getItem("success");

        if(currLevel== 'easy'){
            stats["level1"].attempts = attempts;
            stats["level1"].word = toGuess;
            stats["level1"].time = time;
            stats["level1"].success = success;
        }
        if(currLevel== 'medium'){
            stats["level2"].attempts = attempts;
            stats["level2"].word = toGuess;
            stats["level2"].time = time;
            stats["level2"].success = success;
        }
        if(currLevel== 'hard'){
            stats["level3"].attempts = attempts;
            stats["level3"].word = toGuess;
            stats["level3"].time = time;
            stats["level3"].success = success;
        }

        // add new info to the stats list
        localStorage.setItem("stats", JSON.stringify(stats));

    }

console.log(stats);


}


// start the game
let toGuess = localStorage.getItem("wordToGuess");
let level = localStorage.getItem("currentLevel");
startGame(toGuess,level);




//const stats = JSON.parse(localStorage.getItem("stats"));
function openStatsAsCSV() {
    const stats = JSON.parse(localStorage.getItem("stats")) || {
        level1:{ attempts:"", word:"", time:"", success:"" },
        level2:{ attempts:"", word:"", time:"", success:"" },
        level3:{ attempts:"", word:"", time:"", success:"" }
    };

    const rows = [
        ["Level", "Attempts", "Word", "Time", "Success"],
        ["Level 1", stats.level1.attempts, stats.level1.word, stats.level1.time, stats.level1.success],
        ["Level 2", stats.level2.attempts, stats.level2.word, stats.level2.time, stats.level2.success],
        ["Level 3", stats.level3.attempts, stats.level3.word, stats.level3.time, stats.level3.success]
    ];

    const csvContent = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const tempLink = document.createElement('a');
    tempLink.href = url;
    // Set the filename here. This forces a download!
    tempLink.download = 'ReGuess_Game_Stats.csv'; 
    
    // Simulate a click on the link
    tempLink.click();

    // Clean up the temporary URL to free memory
    URL.revokeObjectURL(url);
}

// Attach listener after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const a = document.getElementById("downloadStats");
    if(a) {
        a.addEventListener("click", (e) => {
            e.preventDefault();  // Prevents the browser from navigating to '#'

            // ⬅️ ADD THIS LINE HERE
            console.log("Stats button clicked! Attempting download.");

            openStatsAsCSV();
        });
    }
});







