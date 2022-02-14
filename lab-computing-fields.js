// working query
db.movies.aggregate([
  {
    $match: {},
  },
  {
    $project: { _id: 0, title: { $split: ['$title', ' '] } },
  },
  {
    $project: {
      title: 1,
      titleSize: { $size: '$title' },
    },
  },
  {
    $match: { titleSize: { $eq: 1 } },
  },
]).itcount();

//---------
// working query
db.movies.aggregate([
  {
    $project: { _id: 0, title: { $split: ['$title', ' '] } },
  },
  {
    $project: {
      title: 1,
      titleSize: { $size: '$title' },
    },
  },
  {
    $match: { titleSize: { $eq: 1 } },
  },
]).itcount();

// ------
// correct answer
db.movies.aggregate([
  {
    $match: {
      title: {
        $type: 'string',
      },
    },
  },
  {
    $project: {
      title: { $split: ['$title', ' '] },
      _id: 0,
    },
  },
  {
    $match: {
      title: { $size: 1 },
    },
  },
]).itcount();

const ArrayMapInMongoDB = {
  writers: {
    $map: {
      input: '$writers',
      as: 'writer',
      in: {
        $arrayElemAt: [
          {
            $split: ['$$writer', ' ('],
          },
          0,
        ],
      },
    },
  },
};

// ------
// finding out "labor of love" movies
/*
* Problem:
* Let's find how many movies in our movies collection are a "labor of love", where the same
* person appears in cast, directors, and writers
* Hint: You will need to use $setIntersection operator in the aggregation pipeline to find
* out the result.
* Note that your dataset may have duplicate entries for some films. You do not need to count
* the duplicate entries.
* To get a count after you have defined your pipeline, there are two simple methods.
* */
db.movies.aggregate([
  {
    $match: {
      title: {
        $type: 'string',
      },
      writers: {
        $type: 'array'
      },
      cast: {
        $type: 'array'
      },
      directors: {
        $type: 'array'
      }
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      cast: 1,
      directors: 1,
      writers: {
        $map: {
          input: '$writers',
          as: 'writer',
          in: {
            $arrayElemAt: [
              {
                $split: ['$$writer', ' ('],
              },
              0,
            ],
          },
        },
      },
    },
  },
  {
    $project: {
      title: 1,
      cast: 1, directors: 1, writers: 1,
      matchingWriters: { $setIntersection: ['$cast', '$writers', '$directors'] },
    },
  },
  {
    $addFields: {
      matchingWritersCount: { $size: '$matchingWriters' }
    }
  },
  {
    $match: {
      matchingWritersCount: { $gte: 1 },
    },
  },
  {
    $count: "labors of love",
  },

]).pretty();

// correct answer from the course website
db.movies.aggregate([
  {
    $match: {
      cast: { $elemMatch: { $exists: true } },
      directors: { $elemMatch: { $exists: true } },
      writers: { $elemMatch: { $exists: true } }
    }
  },
  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
        $map: {
          input: "$writers",
          as: "writer",
          in: {
            $arrayElemAt: [
              {
                $split: ["$$writer", " ("]
              },
              0
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      labor_of_love: {
        $gt: [
          { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
          0
        ]
      }
    }
  },
  {
    $match: { labor_of_love: true }
  },
  {
    $count: "labors of love"
  }
])
