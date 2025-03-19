const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

const users = [];
let listNames = [];

const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('rental');
const collection = db.collection('house');

try {
  await db.command({ ping: 1 });
  console.log(`DB connected to ${config.hostname}`);
} catch (ex) {
  console.log(`Error with ${url} because ${ex.message}`);
  process.exit(1);
}


// get the list of choosen names to display in /choose.jsx
apiRouter.get('/names', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);

  if (user) {
      res.send({ listNames });
  } else {
      res.status(401).send({ msg: 'Unauthorized' });
  }
});

// update list of choosen names
apiRouter.post('/updateNames', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  
  if (user && req.body.listNames) {
      listNames = [...listNames, ...req.body.listNames];
      res.send({ msg: 'List of Names updated', listNames });
  } else {
      res.status(400).send({ msg: 'Invalid request' });
  }
});


// get user's theme
apiRouter.get('/theme', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);

    if (user) {
        res.send({ theme: user.theme });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});
  
// update theme for the players and the overall theme
apiRouter.post('/updateTheme', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser('token', token);
    
    if (user && req.body.theme) {
        user.theme = req.body.theme;
        console.log("Bob")
        res.send({ msg: 'Theme updated', theme: user.theme });
    } else {
        res.status(400).send({ msg: 'Invalid request' });
    }
});

// create account
apiRouter.post('/auth', async (req, res) => {
  if (await getUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user);

    res.send({ username: user.username });
  }
});

//login
apiRouter.put('/auth', async (req, res) => {
  const user = await getUser('username', req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);

    res.send({ username: user.username });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});


// logout
apiRouter.delete('/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }
  
  res.send({});
});


// getme
apiRouter.get('/user/me', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ username: user.username });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    theme: 'First Time!'
  };

  users.push(user);
  return user;
}

async function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}

function setAuthCookie(res, user) {
  user.token = uuid.v4();

  res.cookie('token', user.token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
}

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});