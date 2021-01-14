const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  const port = parseInt(process.env.PORT || '3333');
  
  app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
})
.catch(error => {
  console.error('Unable to connect to database...');
  console.error('Error:', error);
});