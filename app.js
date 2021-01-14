/* eslint-disable strict */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const auth = require('./src/Routes/auth');
const postRouter = require('./src/Routes/post');
const validateToken = require('./src/Validation/validate-jwt');

dotenv.config();

// TODO -> You were about to create the user schema in models

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/user', auth);
app.use('/api', validateToken, postRouter);

const uri = process.env.DB_CONNECT;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((err) => console.log(err));

app.listen(3000, () => console.log('Listening on port 3000'));
