
// update difficulty buttons based on current level
function updateDifficultyButtons(){

    const enableMedium = localStorage.getItem("enableMedium");
    const enableHard = localStorage.getItem("enableHard");

    if(enableMedium === "true"){
        document.getElementById("mediumLevel").disabled = false;
        document.getElementById("easyLevel").disabled = true;
    }
    if(enableHard === "true"){
        document.getElementById("hardLevel").disabled = false;
        document.getElementById("mediumLevel").disabled = true;
    }
}

// call the function to update buttons on page load
if(window.location.href.includes("difficultyPage.html")){
    
    updateDifficultyButtons();
}