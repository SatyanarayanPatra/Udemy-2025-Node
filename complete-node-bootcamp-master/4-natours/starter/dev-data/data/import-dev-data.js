const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });
const fs = require('fs');
const Tour = require('../../models/toursModel.js');
// console.log(process.env.DATABASE);

mongoose
  .connect(
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log('DB connection failed!');
    console.log(err.message);
  });

// Read JSON file
const tours = fs.readFileSync('./tours-simple.json', 'utf8');
const toursData = JSON.parse(tours);

// Import data into MongoDB

const importData = async () => {
  try {
    await Tour.create(toursData);
    console.log('Data imported successfully!');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Delete data from the database

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted successfully!');
    process.exit();
  } catch (err) {
    console.error('Error deleting data:', err);
  } finally {
    mongoose.connection.close();
  }
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}
