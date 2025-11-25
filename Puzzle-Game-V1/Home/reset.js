// reset local storage variables
function resetGame() {
    localStorage.setItem("enableMedium", "false");
    localStorage.setItem("enableHard", "false");
}
if(window.location.href.includes("homePage.html")){
    resetGame();
}