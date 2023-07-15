const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

// Routers
const apiRouter = require(path.join(__dirname, '/routes/api.js'));

// Parse incoming JSON, static reqeusts, forms, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./dist'));


// API router for server handling of db info
app.use('/api', apiRouter);

// Default unknown page handler
app.use('*', (req,res)=>{
  res.status(404).send('Error: Page not found.');
});

// Express error handler
app.use((err, req, res, next) =>{
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred.' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, ()=> {
  console.log(`Server listening on port ${PORT}.`);
});

module.exports = app;