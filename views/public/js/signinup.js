function signup() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username.length < 3) {
        alert("Username needs to be longer than 2 characters");
        return;
    }
    if (password.length < 3) {
        alert("Password needs to be longer than 3 characters");
        return;
    }
    let newUser = {name: username,
        password: password, 
        accountType: 0, 
        following: [], 
        userFollowing: [], 
        watchedMovies: [], 
        reviews: [],
        notifications: []};

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 || this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "New user has been successfully created.") {
                window.location.href = "/user/self"
            } else if (this.responseText == "This account already exists. Try signing in!") {
                document.getElementById("password").value = "";
            } else if (this.responseText == "You are already logged in. New user has been successfully created.") {
                window.location.href = "/user/self";
            } 
        }
    }
    xhttp.open("POST", "/user");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newUser));
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username.length == 0) {
        alert("Please enter a username");
        return;
    }
    if (password.length == 0) {
        alert("Please enter a password");
        return;
    }
    let user = {
        username: username,
        password: password
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "You are now logged as the user: " + user.username) {
                window.location.href = "/user/self";
            } else if (this.responseText == "Incorrect Password") {
                document.getElementById("password").value = "";
            } else if (this.responseText == "User can't be found") {
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
            }
        }
    }
    xhttp.open("POST", "/user/login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}