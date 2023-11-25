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

// Sample User Accounts Database
const db = {
    'jdoe': {
        username: 'jdoe',
        name: 'John Doe',
        id: 1,
        description: 'John Doe is a fictional character',
        currency: 'USD',
        balance: 100.00,
        transactions: []
    },
    'bsmith': {
        username: 'bsmith',
        name: 'Bob Smith',
        id: 2,
        description: 'Bob Smith is a fictional character',
        currency: 'USD',
        balance: 100.00,
        transactions: []
    },
    'jbloggs': {
        username: 'jbloggs',
        name: 'Joe Bloggs',
        id: 3,
        description: 'Joe Bloggs is a fictional character',
        currency: 'USD',
        balance: 100.00,
        transactions: []
    }
}


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

router.get('/accounts/:username', (req, res) => {
    const username = req.params.username;
    const account = db[username];
    if (account) {
        res.json(account);
    } else {
        res.status(404).send(`Account ${username} not found`);
    }
});

app.use(apiRoot, router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});