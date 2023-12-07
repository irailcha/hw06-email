/* eslint-disable no-undef */
const mongoose = require('mongoose');
const app = require('./app');
const request = require('supertest');
const User = require('./models/User');




describe("test /login" , () => {


let server=null;
beforeAll( async ()=>{
    await mongoose.connect(process.env.DB_TEST_HOST);
    server=app.listen(PORT=3000);
})

afterAll ( async ()=>{
    await mongoose.disconnect();
    server.close();
})

afterEach(async() => {
    await User.deleteMany()
    server.close();
  });

test("test /login" , async()=>{
    const loginData = { email: 'Rav4@gmail.com', password: '12345678' };
    const {body, statusCode} = await request(app)
    .post('/login')
    .send(loginData);

 
  expect(body.token).toBe(loginData.token);
  expect(body.user).toBe(loginData.user);

  const user = await User.findOne({ email: loginData.email });
  if (user !== null) {
    expect(statusCode).toBe(200);
    expect(user.email).toBe(loginData.user.email);
    expect(typeof user.email).toBe('string');
    expect(user.subscription).toBe(loginData.user.subscription);
    expect(typeof user.subscription).toBe('string');
  } else {

    console.error('User not found');
  }

})
})





