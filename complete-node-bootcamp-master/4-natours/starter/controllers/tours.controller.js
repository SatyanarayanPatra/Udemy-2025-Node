const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

const checkID = function (req, res, next, val) {
  if (+val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.requestTime);
  const tour = tours.find((el) => el.id === +req.params.id);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: tour,
  });
};

const createTour = (req, res) => {
  console.log(req.requestTime);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = req.body;
  newTour.id = newId;
  tours.push(newTour);
  const data = JSON.stringify(tours);
  fs.writeFile('./dev-data/data/tours-simple.json', data, (err) => {
    res.status(201).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  console.log(req.requestTime);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkID,
};
