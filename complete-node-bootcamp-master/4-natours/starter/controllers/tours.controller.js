const Tour = require('../models/toursModel.js');
// const tours = JSON.parse(
//   fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
// );

// const checkID = function (req, res, next, val) {
// //   if (+val > tours.length) {
// //     return res.status(404).json({
// //       status: 'fail',
// //       message: 'Invalid ID',
// //     });
// //   }
// //   next();
// };

const getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A - FILTERING
    // console.log('req.query', req.query);
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B - ADVANCED FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // { duration: { $get : 5 }, difficulty: 'easy' }
    // { difficulty: 'easy', duration: { gte: '5' } }
    // gte, gt, lte, lt

    // 2 - SORTING
    let query = Tour.find(JSON.parse(queryString));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // EXECUTE QUERY

    const allTours = await query;

    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(req.query.duration)
    //   .where('difficulty')
    //   .equals(req.query.difficulty);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    console.error('ERROR 🎇', err);
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: 'Deleted',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  //   checkID,
};
