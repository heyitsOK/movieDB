function addToWatchlist() {
    let movie = {id: mID,
                title: mTitle};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            if (this.responseText.includes("has been added to your watched list!")) {
                window.location.href = "/movies/" + mID;
            }
        }
    }
    xhttp.open("POST", "/user/watchedMovies");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(movie));
}

function addReview() {
    let summary = document.getElementById("reviewSum").value;
    let score = document.getElementById("score").value;
    let review = document.getElementById("txtReview").value;
    if (score == "") {
        alert("Review score is a required field")
        return;
    } else if (isNaN(score) || parseInt(score) > 10 || parseInt(score) < 0) {
        alert("Review score needs to be a number from 1 - 10");
        return;
    }
    let body = {txtSum: summary,
                txtScore: score,
                txtReview: review,
                movieID: mID};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 || this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "Review has been added!") {
                window.location.href = "/movies/" + mID;
            } else if (this.responseText == "Login or signup to write reviews.") {
                window.location.href = "/signinup.html";
            }
        }
    }
    xhttp.open("POST", "/reviews");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
}