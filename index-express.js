const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const apiRoot = '/api/v1';

const package = require('./package.json');

// Get data from accountsService
const accountsService = require('./services/accountService.js');

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(cors());

// Get sample User Accounts Database
const accounts = accountsService();

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

/* Get account by username */
router.get('/accounts/:username', (req, res) => {
    const username = req.params.username;
    const account = accounts[username];
    if (account) {
        res.json(account);
    } else {
        res.status(404).send(`Account ${username} not found`);
    }
});

/* Add a new account */
router.post('/accounts', (req, res) => {
    const body = req.body;

    //validate required values
    if (!body.username || !body.name || !body.currency) {
        return res
            .status(400)
            .json({ 'Error': 'username, name and currency are required' });
    }

    //validate username is unique
    if (accounts[body.username]) {
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
        id: Object.keys(accounts).length + 1,
        description: body.description,
        currency: body.currency,
        balance: body.balance || 0,
        transactions: []
    };
    accounts[account.username] = account;
    return res.status(201).json(account);
});

/* Update an existing account */
router.put('/accounts/:username', (req, res) => {
    const username = req.params.username;
    const body = req.body;

    //validate account exists
    if (!accounts[username]) {
        return res
            .status(404)
            .json({ 'Error': `Account ${username} not found` });
    }

    //validate balance is present and is a number
    if (body.balance && isNaN(body.balance)) {
        return res
            .status(400)
            .json({ 'Error': 'balance must be a number' });
    }

    //update account object
    const account = accounts[username];
    account.name = body.name || account.name;
    account.description = body.description || account.description;
    account.currency = body.currency || account.currency;
    account.balance = body.balance || account.balance;
    return res.status(201).json(account);
});

/* Delete an existing account */
router.delete('/accounts/:username', (req, res) => {
    const username = req.params.username;

    //validate account exists
    if (!accounts[username]) {
        return res
            .status(404)
            .json({ 'Error': `Account ${username} not found` });
    }

    //delete account object
    delete accounts[username];
    return res.status(204).send();
});

app.use(apiRoot, router);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});