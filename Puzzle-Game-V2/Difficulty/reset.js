// reset local storage variables
function resetGame() {
    localStorage.setItem("enableMedium", "false");
    localStorage.setItem("enableHard", "false");
    // reset stats list for new user
    localStorage.removeItem("stats"); 
    
    // reset variables not needed for now
    //localStorage.removeItem("wordToGuess");
    //localStorage.removeItem("currentLevel");
    //localStorage.removeItem("time");
    //localStorage.removeItem("attempts");
    //localStorage.removeItem("success");
    location.reload();
}

