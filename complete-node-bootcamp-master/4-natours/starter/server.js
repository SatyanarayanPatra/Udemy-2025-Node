const { app, port } = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
require('./db.js');

const uri = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);



app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
