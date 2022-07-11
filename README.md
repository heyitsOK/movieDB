
# Movie Database

This project is fully functioning web application similar to the Internet Movie Database (IMDb). The application maintains a database of movie information, including
things like the movie title, release year, writers, actors, etc. The site supports regular
users, who are capable of browsing all of the information on the site and adding
movie reviews. The site also supports contributing users, who are able to add
new people/movies. The site will also offer movie recommendations based on a user’s
data. Users can search for movies by title, genre, or actor and can also look at the different
people involved in creating the movie (director, writer, actor). Each person has their own page
which includes a list of people they frequently collaborate with and a list of their work history.


## Tech Stack

**Server:** Node, Express, Pug

**Database:** MongoDB

**Template Engine:** Pug

**Other dependencies:** Express-session



## Run Locally

Clone the project

```bash
  git clone https://github.com/heyitsOK/movieDB
```

Go to the project directory

```bash
  cd movieDB
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

The application should be running locally on port 3000 by default (Change port in .env). Go to localhost:3000 to test it.


## Demo

The web application is fully functional and hosted via heroku. To demo the web application click the link below

https://obscure-escarpment-62580.herokuapp.com/

## Acknowledgements

 - [Data provided by Open Movie Database API](http://www.omdbapi.com/)


