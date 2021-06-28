function addMovie() {
    let title = document.getElementById("title").value;
    let runtime = document.getElementById("runtime").value;
    let genre = document.getElementById("genre").value;
    let releaseyear = document.getElementById("releaseyear").value;
    let rating = document.getElementById("rating").value;
    let releasedate = document.getElementById("releasedate").value;
    let plot = document.getElementById("plot").value;
    let awards = document.getElementById("awards").value;
    let poster = document.getElementById("poster").value;
    let writers = document.getElementById("writersList").innerHTML;
    let directors = document.getElementById("directorsList").innerHTML;
    let actors = document.getElementById("actorsList").innerHTML;

    if (title == "" || releaseyear == "" || runtime == "" || plot == "" || genre == "" || actors == "" || writers == "" || directors == "" || poster == "") {
        alert("Title, Release Year, Runtime, Plot, Genre, Poster Link, Writer, Director, and Actor are all required fields")
        return;
    }

    let newMovie = {
        Title: title,
        Year: releaseyear,
        Rated: rating,
        Released: releasedate,
        Runtime: runtime,
        Genre: [genre],
        Director: directors.split(", "),
        Writer: writers.split(", "),
        Actors: actors.split(", "),
        Plot: plot,
        Awards: awards,
        Poster: poster,
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 || this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "You must be logged in as a contributing user to add movies") {
                window.location.href = "/signinup.html"
            } else if (this.responseText.includes("Movie has been added to database at ID ")) {
                let id = this.responseText.slice(39)
                window.location.href = "/movies/" + id;
            } else if (this.responseText == "This movie title already exists in our database"){
                title == "";
            }

        }
    }
    xhttp.open("POST", "/movies");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newMovie));
}

function addPerson() {
    var personName = document.getElementById("name").value;
    if (personName == "") {
        alert("When adding a person, name is a required field.")
        return;
    }
    let newPerson = {
        name: personName,
        writer: [],
        director: [],
        actor: [],
        frequentCollabs: {},
        collabs: []
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 || this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "You must be logged in as a contributing user to add people.") {
                window.location.href = "/signinup.html";
            } else if (this.responseText.includes(" has been added to the database.")) {
                window.location.href = "/people/" + personName;
            } else if (this.responseText == "This person already exists in the database.") {
                personName = "";
            }
        }
    }
    xhttp.open("POST", "/people");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newPerson));
}

function searchPeople(field) {
    let keyword = document.getElementById(field).value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let results = JSON.parse(this.responseText);
            var list = document.getElementById(field + "Search");
            while(list.firstChild) {
                list.removeChild(list.firstChild);
            }
            for (let i = 0; i < results.length; i++) {
                var listItem = document.createElement("INPUT");
                listItem.type = "checkbox";
                listItem.name = results[i].name;
                var label = document.createElement("label");
                label.htmlFor = results[i].name;
                label.appendChild(document.createTextNode(results[i].name));
                label.style = "font-weight: bold;"
                list.appendChild(listItem);
                list.appendChild(label);
                list.appendChild(document.createElement("BR"))
            }
            var add = document.createElement("BUTTON")
            add.type = "button"
            add.innerHTML = "Add"
            add.onclick = function() {
                var people = document.getElementById(field+"List");
                const checkboxes = document.getElementById(field+"Search").querySelectorAll('input[type="checkbox"]:checked')
                checkboxes.forEach((checkbox) => {
                    if(people.innerHTML != "") {
                        people.innerHTML += ', ' + checkbox.name;
                    } else {
                        people.innerHTML += checkbox.name;
                    }
                    checkbox.checked = false;
                })
            }
            list.appendChild(document.createElement("BR"));
            list.appendChild(add);
        }
    }
    xhttp.open("GET", "/people?name=" + keyword);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}
