const http = require('http');
const pug = require("pug");
const fs = require("fs");
const express = require('express');
const session = require('express-session');
let app = express();

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

app.use(express.json());
app.use(express.static("./views/public"));
app.use(session({
	cookie: {
		maxAge: 500000
	},
	secret: "secret key"
}));
app.use(express.urlencoded({extended:true}));

//Movie Requests

app.get("/movies", (request, response) => {
	let pageHeader = "List of all Movies";
	let title = request.query.title || ""
	let genre = request.query.genre || "";
	let actor = request.query.actor || "";
	let pageNumber = parseInt(request.query.page) || 1;
	let searchQuery = {}
	searchQuery.Title = {$regex:title,$options:'i'};
	searchQuery.Genre = {$regex:genre,$options:'i'};
	searchQuery.Actors = {$regex:actor,$options:'i'};
	if (searchQuery.Title == '') {
		delete searchQuery.Title;
	}
	if (searchQuery.Genre == '') {
		delete searchQuery.Genre;
	}
	if (searchQuery.Actors == '') {
		delete searchQuery.Actors;
	}
	db.collection("movies").find(searchQuery).project({"_id": 1, "Title": 1, "Poster": 1}).toArray(function(err, result) {
		if(err) throw err;
		if (title != "") {
			pageHeader = `Top Search Results for "${title}"`;
		}
		if (genre != "") {
			pageHeader += ` in genre "${genre}"`;
		}
		if(actor != "") {
			pageHeader += ` with actor "${actor}"`;
		}
		response.status(200);
		response.contentType(".html");
		result = result.slice((pageNumber-1)*25,(pageNumber*25)-1);
		response.send(pug.renderFile("views/pages/movies.pug", {movies:result, title:pageHeader, page:pageNumber}))
	});
});

app.get("/movies/:id", (request, response)=> {
	targetReviews = [];
	averageScore = 0;
	recommendedMovies = [];
	//let user = users[request.session.username] || "guest";
	let oid;
	try {
		oid = new mongo.ObjectID(request.params.id);
	} catch {
		response.status(404).send("Unknown ID");
		return;
	}
	db.collection("movies").findOne({"_id": oid}, function(err, targetMovie) {
		if (err) {
			response.status(500).send("Error reading database.")
		}
		if (!targetMovie) {
			response.status(404).send("Unknown ID");
			return;
		}
		let searchQuery = []
		searchQuery.push({Actors: {$in: targetMovie.Actors}});
		searchQuery.push({Genre: {$in: targetMovie.Genre}});
		db.collection('movies').find({$or: searchQuery}).project({_id:1, Title: 1, Poster: 1}).toArray(function (err, pool) {
			if (err) throw err;

			recommendedMovies = [];
			if (pool.length > 10) {
				while(recommendedMovies.length < 10) {
					let mov = pool[Math.floor(Math.random() * pool.length)]
					if (!recommendedMovies.includes(mov) && mov != targetMovie) {
						recommendedMovies.push(mov);
					}
				}
			} else {
				recommendedMovies = pool.filter(movie => movie.Title != targetMovie.Title);
			}
			db.collection('reviews').find({mID: oid}).project({movie: 0}).toArray(function (err, targetReviews) {
				let averageScore = 0;
				for (let i = 0; i < targetReviews.length; i++) {
					averageScore += parseInt(targetReviews[i].score);
				}
				if (averageScore != 0) {
					averageScore = (averageScore/targetReviews.length).toFixed(1);
				} else {
					if (targetReviews.length == 0) {
						averageScore = -1;
					}
				}
				db.collection("users").findOne({name: request.session.username}, {watchedMovies: 1}, function(err, user) {
					if (user) {
						response.status(200);
						response.send(pug.renderFile("./views/pages/movie.pug", {movie: targetMovie, reviews: targetReviews, rating: averageScore, currentUser: user, similarMovies: recommendedMovies}));
					} else {
						response.status(200);
						response.send(pug.renderFile("./views/pages/movie.pug", {movie: targetMovie, reviews: targetReviews, rating: averageScore, currentUser: "guest", similarMovies: recommendedMovies}));
					}
				});
			});
		});
		
	});
	
});

app.post("/movies", (request, response) => {
	let newMovie = request.body;
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, {accountType:1},function(err, client) {
			if (err) throw err;
			if (client.accountType == 1) {
				db.collection("movies").findOne({Title: newMovie.Title}, {Title: 1},function (err, result) {
					if (err) throw err;
					if (result) {
						response.status(400).send("This movie title already exists in our database");
						return;
					} else {
						db.collection("movies").insertOne(newMovie, function (err, result) {
							if (err) {
								response.status(500).send("Error saving to the database");
								return;
							} else {
								db.collection("people").updateMany({name: {$in: newMovie.Director}}, {$push: {director: newMovie.Title}}, function(err, res) {
									if (err) throw err;
									for (let i = 0; i < newMovie.Director.length; i++) {
										let notification = {
											type: "person",
											about: newMovie.Director[i],
											text: " has directed a new movie called ",
											movie: newMovie,
											link: "/movies/" + result.insertedId
										}
										db.collection("users").updateMany({following: notification.about}, {$push: {notifications: notification}}, function (err, result) {
											if (err) throw err;
										})
									}
								});
								db.collection("people").updateMany({name: {$in: newMovie.Writer}}, {$push: {writer: newMovie.Title}}, function(err, res) {
									if (err) throw err;
									for (let i = 0; i < newMovie.Writer.length; i++) {
										let notification = {
											type: "person",
											about: newMovie.Writer[i],
											text: " has written for a new movie called ",
											movie: newMovie,
											link: "/movies/" + result.insertedId
										}
										db.collection("users").updateMany({following: notification.about}, {$push: {notifications: notification}}, function (err, result) {
											if (err) throw err;
										})
									}
								});
								db.collection("people").updateMany({name: {$in: newMovie.Actors}}, {$push: {actor: newMovie.Title}}, function(err, res) {
									if (err) throw err;
									for (let i = 0; i < newMovie.Actors.length; i++) {
										let notification = {
											type: "person",
											about: newMovie.Actors[i],
											text: " has acted in a new movie called ",
											movie: newMovie,
											link: "/movies/" + result.insertedId
										}
										db.collection("users").updateMany({following: notification.about}, {$push: {notifications: notification}}, function (err, result) {
											if (err) throw err;
										})
									}
								});
								response.status(200).send("Movie has been added to database at ID " + result.insertedId);
							}
						});
					}
				});
			} else {
				response.send("You must be logged in as a contributing user to add movies")
				response.status(403);
			}
		});
	} else {
		response.send("You must be logged in as a contributing user to add movies")
		response.status(401);
	}
});

//User Requests

app.get("/user/:username", (request, response) => {
	if (request.params.username == "self" || request.params.username == request.session.username) {
		if (request.session.loggedIn == true) {
			db.collection("users").findOne({name: request.session.username},function (err, targetUser) {
				if (err) throw err;

				let actors = [];
				let genres = [];
				for (let i = 0; i < targetUser.watchedMovies.length; i++) {
					actors = actors.concat(targetUser.watchedMovies[i].Actors);
					genres = genres.concat(targetUser.watchedMovies[i].Genre);
				}
				for (let i = 0; i < targetUser.reviews.length; i++) {
					actors = actors.concat(targetUser.reviews.movie.Actors);
					genres = genres.concat(targetUser.reviews.movie.Genre);
				}
				let searchQuery = []
				searchQuery.push({Actors: {$in: actors}});
				searchQuery.push({Genre: {$in: genres}});
				db.collection('movies').find({$or: searchQuery}).project({_id: 1, Title: 1, Poster: 1}).toArray(function (err, pool) {
					if (err) throw err;
		
					recommendedMovies = [];
					if (pool.length > 10) {
						while(recommendedMovies.length < 10) {
							let mov = pool[Math.floor(Math.random() * pool.length)]
							if (!recommendedMovies.includes(mov)) {
								recommendedMovies.push(mov);
							}
						}
					} else {
						recommendedMovies = pool;
					}
					response.contentType(".html");
					response.status(200).send(pug.renderFile("./views/pages/selfprofile.pug", {user: targetUser, recommended: recommendedMovies}));
				});
			})
		} else {
			response.status(401);
			response.redirect("/signinup.html");
		}
	} else {
		db.collection("users").findOne({name: request.params.username}, {accountType: 0}, function (err, targetUser) {
			if (err) throw err;

			if (targetUser) {
				db.collection("reviews").find({aID: targetUser._id}).project({author: 1, mID: 1, score:1, reviewSummary: 1, "movie.Title": 1}).toArray(function(err, targetReviews) {
					if (err) throw err;

					db.collection("users").findOne({name: request.session.username}, {following:1, userFollowing:1},function(err, currentUser) {
						if (err) throw err;

						let client;
						if (currentUser) {
							client = currentUser;
						} else {
							client = "guest";
						}
						response.contentType(".html");
						response.status(200).send(pug.renderFile("./views/pages/user.pug", {user: targetUser, reviews: targetReviews, currentUser: client}))
					});
				});
			} else {
				response.status(404).send('Cannot find user "' + request.params.username + '". Probably because the user does not exist.');
			}
		});
	}
});

app.post("/user/login", (request, response) => {
	if (request.session.loggedIn) {
		response.send("You are already logged in")
	} else {
		let user = request.body;
		db.collection("users").findOne({name: user.username}, function (err, targetUser) {
			if (err) throw err;
			
			if (targetUser) {
				if (user.password == targetUser.password) {
					request.session.username = targetUser.name;
					request.session.loggedIn = true;
					response.status(200).send("You are now logged as the user: " + targetUser.name);
				} else {
					response.send("Incorrect Password");
					response.status(401);
				}
			} else {
				response.send("User can't be found");
				response.status(404)
			}
		});
	}
});

app.post("/user/logout", (request, response) => {
	request.session.loggedIn = false;
	request.session.username = "";
	response.status(200).send("Successfully signed out");
});

app.post("/user", (request, response) => {
	let newUser = request.body

	db.collection("users").findOne({name:newUser.name}, {name:1}, function (err, result) {
		if (err) throw err;

		if (result) {
			response.status(409).send("This account already exists. Try signing in!");
		} else {
			db.collection("users").insertOne(newUser, function (err, result) {
				if (err) {
					response.status(500).send("Error saving to the database");
					return;
				} else {
					if (request.session.loggedIn) {
						response.status(201).send("You are already logged in. New user has been successfully created.");
					} else {
						request.session.loggedIn = true;
						request.session.username = newUser.name;
						response.status(201).send("New user has been successfully created.");
					}
				}
			});
		}
	});
});

app.post("/user/watchedMovies", (request, response) => {
	let movie = request.body;
	
	if (request.session.loggedIn) {
		/*users[request.session.username].watchedMovies.push(movies[movie.id]);
		response.send(movie.title + " has been added to your watched list!")
		response.status(200);*/
		try {
			oid = new mongo.ObjectID(movie.id);
		} catch {
			response.status(404).send("Unknown ID");
			return;
		}
		db.collection("movies").findOne({"_id": oid}, function (err, targetMovie) {
			if (err) throw err;
			
			db.collection("users").updateOne({name:request.session.username}, {$push: {watchedMovies: targetMovie}}, function (err, result) {
				if (err) throw err;
				response.send(targetMovie.Title + " has been added to your watched list!")
				response.status(200);
			});
		});
	} else {
		response.send("You are not logged in. This shouldn't even be possible");
		response.status(401);
	}
});

app.post("/user/accountType", (request, response) => {
	if (request.session.loggedIn) {
		//users[request.session.username].accountType = request.body.accountType;
		db.collection("users").updateOne({name: request.session.username}, {$set: {accountType: request.body.accountType}}, function (err, result) {
			response.status(200);
			response.redirect("/user/self");
		})
	} else {
		console.log("This shouldn't be possible");
		response.status(200);
		response.redirect("/user/self");
	}
});

app.post("/user/following", (request, response) => {
	let person = request.body;
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, function(err, client) {
			if (err) throw err;
			if (client.following.includes(person.name)) {
				response.send("You are already following this person");
				response.status(404);
			} else {
				db.collection("users").updateOne(client, {$push: {following: person.name}}, function(err, result) {
					if (err) {
						response.status(500).send("Error saving to database");
					} else {
						response.status(200).send("Followed " + person.name);
					}
				});
			}
		});
	} else {
		response.send("You are not logged in. This shouldn't be possible");
		response.status(401);
	}
});

app.post("/user/userFollowing", (request, response) => {
	let user = request.body
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, function(err, client) {
			if (err) throw err;
			if (client.userFollowing.includes(user.name)) {
				response.send("You are already following this user");
				response.status(404);
			} else {
				db.collection("users").updateOne(client, {$push: {userFollowing: user.name}}, function(err, result) {
					if (err) {
						response.status(500).send("Error saving to database");
					} else {
						response.status(200).send("Followed " + user.name);
					}
				});
			}
		});
	} else {
		response.send("You are not logged in. This shouldn't be possible");
		response.status(401);
	}
});

app.delete("/user/following", (request, response) => {
	let person = request.body
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, function(err, client) {
			if (err) throw err;
			if (client.following.includes(person.name)) {
				db.collection("users").updateOne(client, {$pull: {following: person.name}}, function (err, result) {
					if (err) {
						response.status(500).send("Error saving to database");
					} else {
						response.status(200).send("Unfollowed " + person.name);
					}
				})
			} else {
				response.send("You are not following this person");
				response.status(404);
			}
		});
	} else {
		response.send("You are not logged in. This shouldn't be possible");
		response.status(401);
	}
});

app.delete("/user/userFollowing", (request, response) => {
	let user = request.body
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, function(err, client) {
			if (err) throw err;
			if (client.userFollowing.includes(user.name)) {
				db.collection("users").updateOne(client, {$pull: {userFollowing: user.name}}, function (err, result) {
					if (err) {
						response.status(500).send("Error saving to database");
					} else {
						response.status(200).send("Unfollowed " + user.name);
					}
				})
			} else {
				response.send("You are not following this person");
				response.status(404);
			}
		});
	} else {
		response.send("You are not logged in. This shouldn't be possible");
		response.status(401);
	}
});

app.delete("/user/watchedMovies", (request, response) => {
	let movie = request.body
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, function(err, client) {
			if (err) throw err;
			let included = false;
			db.collection("users").updateOne(client, {$pull: {watchedMovies: {Title: movie.title}}}, function (err, result) {
				console.log(result.modifiedCount);
				if (err) {
					response.status(500).send("Error saving to database");
				} else {
					response.status(200).send("Removed " + movie.title + " from your watched list.");
				}
			})
		});
	} else {
		response.send("You are not logged in. This shouldn't be possible");
		response.status(401);
	}
});

//People requests

app.get("/people", (request, response) => {
	let keyword = request.query.name;
	db.collection("people").find({name: {$regex: keyword, $options:'i'}}).project({name: 1}).toArray(function(err, targetPeople) {
		if(err) throw err;
		
		response.contentType("application/json");
		response.send(JSON.stringify(targetPeople));
		response.status(200);
	});
});

app.get("/people/:personname", (request, response) => {
	db.collection("people").findOne({name: request.params.personname}, {collabs: 0}, function(err, targetPerson) {
		if(err) throw err;

		if (targetPerson) {
			let workHistory = targetPerson.director.concat(targetPerson.writer, targetPerson.actor);
			db.collection("movies").find({Title: {$in: workHistory}}).project({_id:1, Title: 1}).toArray(function (err, work) {
				if (err) throw err;

				workObject = {};
				for (let i = 0; i < work.length; i++) {
					workObject[work[i].Title] = work[i];
				}
				db.collection("users").findOne({name: request.session.username}, {following: 1}, function (err, client) {
					if (client) {
						response.status(200);
						response.contentType(".html");
						response.send(pug.renderFile("./views/pages/person.pug", {person: targetPerson, frequentCollabs: Object.keys(targetPerson.frequentCollabs).splice(-5), movies: workObject, currentUser: client}));
					} else {
						response.status(200);
						response.contentType(".html");
						response.send(pug.renderFile("./views/pages/person.pug", {person: targetPerson, frequentCollabs: Object.keys(targetPerson.frequentCollabs).splice(-5), movies: workObject, currentUser: "guest"}));
					}
				});
			});
		}
	});
});

app.post("/people", (request, response) => {
	let newPerson = request.body;
	if (request.session.loggedIn) {
		db.collection("users").findOne({name: request.session.username}, {accountType: 1}, function (err, client) {
			if (err) throw err;
			if (client && client.accountType == 1) {
				db.collection("people").find({name: {$regex:newPerson.name, $options:'i'}}).project({name: 1}).toArray(function (err, result) {
					if (err) throw err;
					for (let i = 0; i < result.length; i++) {
						if (result[i].name.toUpperCase() == newPerson.name.toUpperCase()) {
							response.send("This person already exists in the database.")
							response.status(400);
							return;
						}
					}
					db.collection("people").insertOne(newPerson, function(err, res) {
						if (err) {
							response.status(500).send("Error saving to the database");
							return;
						} else {
							response.status(201).send(newPerson.name + " has been added to the database.");
						}
					});
				});
			} else {
				response.send("You must be logged in as a contributing user to add people.");
				response.status(403);
			}
		});
	} else {
		response.send("You must be logged in as a contributing user to add people.");
		response.status(401);
	}
});

//Review requests

app.get("/reviews/:id", (request, response) => {
	let oid;
	try {
		oid = new mongo.ObjectID(request.params.id);
	} catch {
		console.log("Unknown ID")
		return;
	}
	db.collection('reviews').findOne({"_id": oid}, function(err, review) {
		if (err) throw err;
		response.status(200);
		response.contentType(".html");
		response.send(pug.renderFile("./views/pages/review.pug", {review: review}))
	});
});

app.post("/reviews", (request, response) => {
	if (request.session.loggedIn) {
		let oid;
		try {
			oid = new mongo.ObjectID(request.body.movieID);
		} catch {
			console.log("Unknown ID")
			return;
		}

		db.collection('movies').findOne({"_id": oid}, function(err, movie) {
			if (err) throw err;
			db.collection("users").findOne({name: request.session.username}, function(err, currentUser) {
				if (err) throw err;
				let newReview = {
					author: currentUser,
					aID: currentUser._id,
					reviewSummary: request.body.txtSum,
					score: request.body.txtScore,
					textReview: request.body.txtReview,
					mID: movie._id,
					movie: movie
				};
	
				db.collection('reviews').insertOne(newReview, function(err, result) {
					if (err) {
						response.status(500).send("Error saving to database.");
						return;
					} else {
						console.log("Successfully inserted " + result.insertedCount + " review");
					}
					response.status(201).send("Review has been added!");
					db.collection('movies').findOne({_id: newReview.mID}, function(err, movie) {
						if (err) throw err;
						let notification = {
							type: "user",
							about: request.session.username,
							text: " has written a new review for ",
							movie: movie,
							link: "/reviews/" + result.insertedId
						}
						db.collection("users").updateMany({userFollowing: notification.about}, {$push: {notifications: notification}}, function (err, result) {
							if (err) throw err;
						})
					})
				});
			});
			
		})

	} else {
		response.send("Login or signup to write reviews.")
		response.status(401);
	}
});

//Start server
MongoClient.connect("mongodb+srv://omar2134:dmxQcAfyLFLf4eAk@cluster0.rcihm.mongodb.net/movieDB?retryWrites=true&w=majority", function(err, client) {
	if (err) throw err;
	
	db = client.db('project');

	app.listen(process.env.PORT || 3000);
	console.log("Server listening at http://localhost:3000");
});