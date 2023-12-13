const mongoose = require('mongoose');
const app = require('./app');





mongoose.connect(process.env.DB_HOST,   {useNewUrlParser: true, useUnifiedTopology: true, ssl: true })
.then(()=>{
  app.listen(process.env.PORT, () => {
    console.log("Database connection successful")
  })
})
.catch(error =>{
  console.log(error.message);
  process.exit(1);
})


