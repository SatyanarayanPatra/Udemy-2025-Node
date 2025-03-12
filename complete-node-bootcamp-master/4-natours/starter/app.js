const fs = require('fs');
const express = require('express');
const app = express();

const port = 3000;

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hello from the server side!', app: 'natours' });
// });
//
// app.post('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'you can post to this endpoint...', app: 'natours' });
// });

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

app.use(express.json());

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params.id);
  const tour = tours.filter((el) => el.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour[0],
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = req.body;
  newTour.id = newId;
  tours.push(newTour);
  const data = JSON.stringify(tours);
  fs.writeFile('./dev-data/data/tours-simple.json', data, (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
