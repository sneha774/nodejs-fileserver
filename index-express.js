const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const apiRoot = '/api/v1';

const package = require('./package.json');

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors());

// Configure Routes
const router = express.Router();
router.get('/', (req, res) => {
    const packageDescription = {
        name: package.name,
        version: package.version,
        description: package.description
    };
    res.send(`Welcome to ${packageDescription.name} v${packageDescription.version}!`);
});
app.use(apiRoot, router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});