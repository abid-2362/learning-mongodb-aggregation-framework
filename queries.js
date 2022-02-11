// this file contains the queries executed while attempting the course.
db.movies.aggregate([
  {
    $match: {
      'imdb.rating': { $gte: 7 },
      genres: { $nin: ['Crime', 'Horror'] },
      rated: { $in: ['PG', 'G'] },
      $and: [{languages: "English"}, {languages: "Japanese"}]
    },
    $limit: 1,
  },
]).itcount();


db.movies.aggregate([
  {
    $match: {
      'imdb.rating': { $gte: 7 },
      genres: { $nin: ['Crime', 'Horror'] },
      rated: { $in: ['PG', 'G'] },
      $and: [{ languages: 'English' }, { languages: 'Japanese' }],
    },
  },
]).itcount();

// --
db.movies.aggregate([
  {
    $match: {
      'imdb.rating': { $gt: 7 },
      genres: { $nin: ['Crime', 'Horror'] },
      rated: { $in: ['PG', 'G'] },
      languages: { $in: ['English', 'Japanese'] },
    },
  },
]).itcount();
