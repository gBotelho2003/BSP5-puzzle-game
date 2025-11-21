


// load words into dictionary
let dictionary= [];
fetch("/Puzzle-Game-V1/words.json")
    .then(res => res.json())
    .then(data => dictionary = data.words)
    .catch(err => console.error("Dictionary load failed:", err));


// determine which difficulty is chosen
function difficulty(level) {
    
    // bag of words
    const easyWords = ["APPLE", "HOUSE", "PLANE", "GRAPE", "TRAIN"];
    const mediumWords = ["BANJO", "GUITA", "MONKY", "CRANE", "BRICK"];
    const hardWords = ["ZEBRA", "JOKER", "QUIRK", "LYNCH", "VIXEN"];

    
    let toGuess = "";
    const random = Math.floor(Math.random()*easyWords.length);
   
    if(level == 'easy') {
        // random word from the list for the game
        toGuess = easyWords[random];
    }
    else if(level == 'medium'){
        // random word from the list for the game
        toGuess = mediumWords[random];
    }
    else if(level == 'hard'){
        // random word from the list for the game
        toGuess = hardWords[random];
    }

    // store the word for the next page
    localStorage.setItem("wordToGuess", toGuess);


    // go to the selected difficulty level
    if(level == 'easy') {
        window.location.href = "/Puzzle-Game-V1/Game/easyLevel.html";
    }
    else if(level == 'medium'){
        window.location.href = "/Puzzle-Game-V1/Game/mediumLevel.html";
    }
    else if(level == 'hard'){
        window.location.href = "/Puzzle-Game-V1/Game/hardLevel.html"; 
    }
}

// the actual game that verifies guesses and the coloring of the letters
function startGame(toGuess){

    // fetch the cells where the letters will be placed
    const cells = document.querySelectorAll('.item');
    let currRow= 0;
    let currCol=0;
    let count = 0;
    const wordLength = 5;

    

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
        count ++;
        for(let i = 0 ; i< wordLength; i++){

            const index = (currRow * wordLength) + i;
            guess.push(cells[index].textContent);
        } 
        const guessedWord = guess.join("");  

        if(!dictionary.includes(guessedWord)){
            showMessage("Not a real word!");
            return;
        }

        // function to see if guess is right or wrong 
        colorGuess(guessedWord);
        

        if(toGuess === guessedWord || count == 5){
            winStats(currRow+1);
            
            return;
        }
        currRow++;
        currCol=0;
    
    }

    function colorGuess(guessedWord){

        // map to keep track of the letters that have been checked
        const letters = new Map();
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

    }


    // make pop up visible and display stats
    function winStats(attempts){
        document.getElementById("attemptedGuesses").innerText = attempts + "/5 guesses";
        document.getElementById("correctWord").innerText += "The word was "+ toGuess;
        const popup = document.getElementById("popup");
            // make the pop up visible
            popup.style.visibility='visible';
    }
    //close the pop up with the stats
    document.getElementById("close").addEventListener("click", () => {
    document.getElementById("popup").style.visibility='hidden';
    });
}


// start the game
const toGuess = localStorage.getItem("wordToGuess");
startGame(toGuess);





