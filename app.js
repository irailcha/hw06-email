const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv=require('dotenv');
const router = require('./routes/api/contacts');
const authRouter = require('./routes/api/users');



dotenv.config();


const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static('public'));

app.use('/users', authRouter);
app.use('/contacts', router);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});


module.exports = app