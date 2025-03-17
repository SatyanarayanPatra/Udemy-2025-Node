const { app, port } = require('./app');

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
