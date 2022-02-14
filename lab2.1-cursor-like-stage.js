/*
* Problem:
MongoDB has another movie night scheduled. This time, we polled employees for their favorite actress or actor, and got these results
favorites = [
  "Sandra Bullock",
  "Tom Hanks",
  "Julia Roberts",
  "Kevin Spacey",
  "George Clooney"]
For movies
* 1. released in the USA
* 2. with a tomatoes.viewer.rating greater than or equal to 3,
* calculate a new field called num_favs that represets how many favorites appear in the cast field of the movie.

Sort your results by num_favs, tomatoes.viewer.rating, and title, all in descending order.
What is the title of the 25th film in the aggregation result?
* */

// lab 2 variables
var favorites = [
  "Sandra Bullock",
  "Tom Hanks",
  "Julia Roberts",
  "Kevin Spacey",
  "George Clooney"]

// ---- My Solution ------
db.movies.aggregate([
  {
    $match: {
      cast: {
        $type: 'array'
      },
      countries: { $in: ['USA'] },
      "tomatoes.viewer.rating": {$gte: 3}
    }
  },
  {
    $project: {
      title: 1,
      cast: 1,
      countries: 1,
      requiredRating: '$tomatoes.viewer.rating',
      favoritesAppeared: {$setIntersection: ["$cast", favorites]},
      num_favs: {$size: {$setIntersection: ["$cast", favorites]}}
    }
  },
  {
    $sort: {
      num_favs: -1, requiredRating: -1, title: -1
    }
  },
  {
    $skip: 24,
  },
  {
    $limit: 1,
  }
]).pretty()
