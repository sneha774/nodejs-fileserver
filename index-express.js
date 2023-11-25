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

// Add a new account
router.post('/accounts', (req, res) => {
    const body = req.body;

    //validate required values
    if (!body.username || !body.name || !body.currency) {
        return res
            .status(400)
            .json({ 'Error': 'username, name and currency are required' });
    }

    //validate username is unique
    if (db[body.username]) {
        return res
            .status(400)
            .json({ 'Error': 'username already exists' });
    }

    //validate balance is present and is a number
    if (body.balance && isNaN(body.balance)) {
        return res
            .status(400)
            .json({ 'Error': 'balance must be a number' });
    }

    //create new account object
    const account = {
        username: body.username,
        name: body.name,
        id: Object.keys(db).length + 1,
        description: body.description,
        currency: body.currency,
        balance: body.balance || 0,
        transactions: []
    };
    db[account.username] = account;
    return res.status(201).json(account);
});

app.use(apiRoot, router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});