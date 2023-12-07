const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const User = require('../models/User');
const fs = require('fs/promises');
const Jimp = require("jimp");
const path = require('path');
const { HttpError } = require('../helpers/HttpError');


const pathAvatar = path.resolve("public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const {path: oldPath, filename} = req.file;
  const newPath = path.join(pathAvatar, filename);

  await fs.rename(oldPath, newPath);


  const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });
  const image = await Jimp.read(newPath);
  await image.resize(250, 250); 
  await image.writeAsync(newPath);


const user = await User.findOne({ email });
if (user) {
    return next(HttpError(409, "Email in use"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body,  avatar: avatarURL,  password: hashedPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL
    }
  });

  if (!email || !password) {
    return next(HttpError(400, 'Validation error: Email and password are required.'));
  }
};




const login = async (req, res, next) => {
const {email, password} = req.body;

const existingUser = await User.findOne({ email });
if (!existingUser) {
  return next(HttpError(401, "Email or password is wrong"));
}


const passwordCompare= await bcrypt.compare(password, existingUser.password);
if(!passwordCompare){
  return next(HttpError(401, "Email or password is wrong"));
}

const payload={
  id: existingUser._id,
}


const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "23h" });
existingUser.token = token;
await existingUser.save();


res.status(200).json({
  token,
  user: {
    email: existingUser.email,
    subscription: existingUser.subscription,
  }
})

}

const current= async (req, res, next) => {
const {email, subscription}=req.user;


if (!email || !subscription) {
  return next(HttpError(401, 'Not authorized'));
}
res.status(200).json({
  
    email,
    subscription
  
  
});



}

const logout= async (req, res, next) => {
const{_id}=req.user;
const user = await User.findByIdAndUpdate(_id, {token:""})
  
  if (!user) {
    return next(HttpError(401, "Not authorized"));
  }

  res.status(204).json({
    message: "No Content"
  });

}


const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  const subscriptions = ['starter', 'pro', 'business'];

  if (!subscriptions.includes(subscription)) {
    return next(HttpError(400, 'Invalid subscription'));
  }

  req.user.subscription = subscription;
  await req.user.save();

  res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription
  
  });
}


const updateAvatar= async(req, res, next) => {
  const {email, subscription}=req.user;


  
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(pathAvatar, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = gravatar.url(email, { s: '200', r: 'pg', d: 'identicon' });
  const image = await Jimp.read(newPath);
  await image.resize(250, 250); 
  await image.writeAsync(newPath);


  if (!email || !subscription) {
    return next(HttpError(401, 'Not authorized'));
  }
  req.user.avatar = avatarURL;
  await req.user.save();

  res.status(200).json({
    avatarURL: avatarURL,
  });
  
  }




module.exports = {
  register,
  login,
  current,
  logout,
  updateSubscription,
  updateAvatar
};

