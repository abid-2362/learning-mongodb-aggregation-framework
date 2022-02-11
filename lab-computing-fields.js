// working query
db.movies.aggregate([
  {
    $match: {}
  },
  {
    $project: {_id:0, title: { $split: ['$title', ' '] }}
  },
  {
    $project: {
      title: 1,
      titleSize: {$size: "$title"}
    }
  },
  {
    $match: {titleSize: {$eq: 1}}
  }
]).itcount()

//---------
// working query
db.movies.aggregate([
  {
    $project: {_id:0, title: { $split: ['$title', ' '] }}
  },
  {
    $project: {
      title: 1,
      titleSize: {$size: "$title"}
    }
  },
  {
    $match: {titleSize: {$eq: 1}}
  }
]).itcount()

// ------
// correct answer
db.movies.aggregate([
  {
    $match: {
      title: {
        $type: "string"
      }
    }
  },
  {
    $project: {
      title: { $split: ["$title", " "] },
      _id: 0
    }
  },
  {
    $match: {
      title: { $size: 1 }
    }
  }
]).itcount()
