function startGame(){

    // fetch the cells where the letters will be placed
    const cells = document.querySelectorAll('.item');
    let currRow= 0;
    let currCol=0;
    let count = 0;
    const wordLength = 5;

    // will get changed by a bag of words
    const toGuess = "HOMER";

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

        for(let i = 0; i < wordLength; i++){

            const index = (currRow * wordLength) + i;
            const letter = guessedWord[i];
            // verify if the letter is in the word and right position
            if(letter == toGuess[i]){
                cells[index].style.backgroundColor = "green";
            }
            // verify if the letter is in the word but in the wrong position
            else if(toGuess.includes(letter)){
                cells[index].style.backgroundColor = "orange";
            }
            // word does not contain letter
            else{
                cells[index].style.backgroundColor = "red";
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

startGame();
