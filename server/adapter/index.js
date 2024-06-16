// server/index.ts
require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.EA_PORT || 8080; // Replace with your desired port

app.use(express.json());
app.post('/', require('./loandiskAdapter').execute); // Use the external adapter as a middleware

app.listen(port, () => {
  console.log(`External adapter listening on port ${port}`);
});
