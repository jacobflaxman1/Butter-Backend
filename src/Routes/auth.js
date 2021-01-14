'use strict';

const router = require('express').Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation } = require('../Validation/validation');
const { loginValidation } = require('../Validation/validation');
const axios = require('axios');

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  console.log('req', req.body, error);
  if (error) {
    return res.status(409).json({ error: error.details[0].message });
  }

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(410).json({ error: 'Email already registered' });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });
  try {
    const savedUser = await user.save();
    res.json({ error: null, data: savedUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  console.log(error, req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: 'No account matching that email' });
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ error: 'Wrong password' });
  }

  const client_id = '4e8f8455d67249839bef6a8dc50cabb7';
  const client_secret = '4d88d35893844a2fab61b9d539ce55c1';
  const encode = Buffer.from(client_id + ':' + client_secret).toString('base64');

  const spotifyToken = await axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      grant_type: 'client_credentials',
    },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: client_id,
      password: client_secret,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {});
  //create token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );
  console.log(spotifyToken);
  res.header('auth-token', token).json({
    error: null,
    data: {
      token,
      user: user.name,
      spotifyToken,
    },
  });
});

module.exports = router;
