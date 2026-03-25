const express = require("express");
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb+srv://prodify:Prodify786@prodify.ocpmvcq.mongodb.net/?appName=Prodify')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
