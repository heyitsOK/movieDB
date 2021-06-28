function signout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "Successfully signed out") {
                window.location.href = "/signinup.html";
            }
        }
    }
    xhttp.open("POST", "/user/logout");
    xhttp.send();
}

function sendAlert() {
    alert("Account Type has been updated.");
}

function unfollowPerson(person) {
    let body = {name: person};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            window.location.reload();
        }
    }
    xhttp.open("DELETE", "/user/following");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
}

function followPerson(person) {
    let body = {name: person};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            window.location.reload();
        }
    }
    xhttp.open("POST", "/user/following");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
}

function unfollowUser(user) {
    let body = {name: user};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            window.location.reload();
        }
    }
    xhttp.open("DELETE", "/user/userFollowing");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
}

function removeMovie(mTitle, mID) {
    let body = {title: mTitle, id: mID};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            window.location.reload();
        }
    }
    xhttp.open("DELETE", "/user/watchedMovies");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
}

function authenticateAlert() {
    alert("You must be signed in to follow people!")
    window.location.href = "/signinup.html"
}

function followUser(user) {
    let body = {name: user};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            window.location.reload();
        }
    }
    xhttp.open("POST", "/user/userFollowing");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(body));
}