const express = require('express');
const bodyParser = require('body-parser');

require("dotenv").config()

const routes = require('./routes')

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use('/api/v1', routes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
