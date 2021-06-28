let movies = require('./data/movie-data/movie-data-2500.json');

let people = {};

let users = [{
	name: "mromarkhan", 
	password: "12345",
	accountType: 1, 
	following: ["Elijah Wood", "Robb Wells", "Adam Sandler", "Peter Jackson"], 
	userFollowing: ["davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "davemckenney",
	password: "lotr",
	accountType: 1,
	following: ["Elijah Wood", "Sandra Bullock", "Adam Sandler"],
	userFollowing: ["mromarkhan", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "seanbenjamin",
	password: "labcoordinator",
	accountType: 1, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "yizhang",
	password: "cao",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "bruce",
	password: "fernandes",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "omar",
	password: "flores",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "raahim",
	password: "ghauri",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "victor",
	password: "litzanov",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "patrick",
	password: "mckay",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "erica",
	password: "morgan",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "temitayo",
	password: "oyelowo",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "shriya",
	password: "satish",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "ammar",
	password: "tosun",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}, {
    name: "wal",
	password: "wal",
	accountType: 0, 
	following: ["Morgan Freeman", "Ashley Judd", "Cary Elwes", "Alex McArthur"], 
	userFollowing: ["mromarkhan", "davemckenney", "seanbenjamin"], 
	watchedMovies: [],
    reviews: [],
	notifications: []
}]

for (let i = 0; i < movies.length; i++) {
    for (let j = 0; j < movies[i].Director.length; j++) {
        let x = String(movies[i].Director[j]);
        if (people.hasOwnProperty(x)) {
            people[x].director.push(movies[i].Title);
        } else {
            people[x] = {
                director: [movies[i].Title],
                writer: [],
                actor: [],
                collabs: [],
                frequentCollabs: {}
            }
        }
        let movieCollabs = movies[i].Director.concat(movies[i].Actors, movies[i].Writer);
        movieCollabs = Array.from([...new Set(movieCollabs)]);
        people[x].collabs = people[x].collabs.concat(movieCollabs);
    }
    for (let j = 0; j < movies[i].Writer.length; j++) {
        let x = movies[i].Writer[j];
        if (people.hasOwnProperty(x)) {
            people[x].writer.push(movies[i].Title);
        } else {
            people[x] = {
                director: [],
                writer: [movies[i].Title],
                actor: [],
                collabs: [],
                frequentCollabs: {}
            }
        }
        let movieCollabs = movies[i].Director.concat(movies[i].Actors, movies[i].Writer);
        movieCollabs = Array.from([...new Set(movieCollabs)]);
        people[x].collabs = people[x].collabs.concat(movieCollabs);
    }
    for (let j = 0; j < movies[i].Actors.length; j++) {
        let x = movies[i].Actors[j];
        if (people.hasOwnProperty(x)) {
            people[x].actor.push(movies[i].Title);
        } else {
            people[x] = {
                director: [],
                writer: [],
                actor: [movies[i].Title],
                collabs: [],
                frequentCollabs: {}
            }
        }
        let movieCollabs = movies[i].Director.concat(movies[i].Actors, movies[i].Writer);
        movieCollabs = Array.from([...new Set(movieCollabs)]);
        people[x].collabs = people[x].collabs.concat(movieCollabs);
    }
}

let peopleNames = Object.keys(people);

for (let i = 0; i < peopleNames.length; i++) {
    let x = peopleNames[i];
    for (let j = 0; j < people[x].collabs.length; j++) {
        if(people[x].frequentCollabs.hasOwnProperty(people[x].collabs[j].replace(/\./g, "-"))) {
            people[x].frequentCollabs[people[x].collabs[j].replace(/\./g, "-")] += 1;
        } else {
            people[x].frequentCollabs[String(people[x].collabs[j]).replace(/\./g, "-")] = 1;
        }
    }
    let counted = Object.entries(people[x].frequentCollabs);
    counted.sort(function(a, b) {
        return a[1] - b[1];
    });
    people[x].frequentCollabs = {};
    counted.forEach(function(item){
        people[x].frequentCollabs[item[0]]=item[1]
    })
}
for (let i = 0; i < peopleNames.length; i++) {
    let x = peopleNames[i];
    if (people[x].frequentCollabs.hasOwnProperty(x)) {
        delete people[x].frequentCollabs[x];
    }
}

for (let i = 0; i < peopleNames.length; i++) {
    people[peopleNames[i]].name = peopleNames[i];
}
let peopleArray = Object.values(people);

let reviews = [];

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb+srv://omar2134:dmxQcAfyLFLf4eAk@cluster0.rcihm.mongodb.net/movieDB?retryWrites=true&w=majority", function(err, client) {
    if(err) throw err;

    db = client.db('movieDB');
    db.dropCollection("movies", function(err, result) {
        if (err) {
            console.log("Error dropping movies collection.");
        } else {
            console.log("Cleared movies collection.");
        }

        db.collection("movies").insertMany(movies, function(err, result) {
            if (err) throw err;
            console.log("Successfully inserted " + result.insertedCount + " movies");
        });

        db.dropCollection("people", function (err, result) {
            if (err) {
                console.log("Error dropping people collection.");
            } else {
                console.log("Cleared people collection.");
            }
    
            db.collection("people").insertMany(peopleArray, function(err, result) {
                if (err) throw err;
                console.log("Successfully inserted " + result.insertedCount + " people");
                console.log("Finished");
                process.exit()
            });
        });

        db.dropCollection("users", function(err, result) {
            if (err) {
                console.log("Error dropping users collection.");
            } else {
                console.log("Cleared users collection.");
            }
    
            db.collection("users").insertMany(users, function(err, result) {
                if(err) throw err;
                console.log("Successfully inserted " + result.insertedCount + " users.");
                   
            });
        });
        
        db.dropCollection("reviews", function(err, result) {
            if (err) {
                console.log("Error dropping reviews collection.");
            } else {
                console.log("Cleared reviews collection.");
            }
        })

    });
});