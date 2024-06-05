const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api/v1', routes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
