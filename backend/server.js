const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT;

const sampleRoutes = require('./routes/sample');

app.listen(port, () => {
    console.log(`server running on port ${port}...`)
});

app.get("/", (req, res) => {
    res.send("Hello world!!!");
});

app.use('/samples', sampleRoutes);

