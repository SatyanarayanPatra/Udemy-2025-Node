const express = require('express');

const { aliasTopTours } = require('../middlewares/aliasTopTours.js');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require('../controllers/tours.controller');

const router = express.Router();

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
