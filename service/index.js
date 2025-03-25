const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const DB = require('./database.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

const authCookieName = 'token'

//const users = [];
//let listNames = [];

// get the list of choosen names to display in /choose.jsx
apiRouter.get('/names', async (req, res) => {
  const token = req.cookies['token'];
  const user = await findUser('token', token);

  if (user) {
      res.send({ listNames });
  } else {
      res.status(401).send({ msg: 'Unauthorized' });
  }
});

// update list of choosen names
apiRouter.post('/updateNames', async (req, res) => {
  const token = req.cookies['token'];
  const user = await findUser('token', token);
  
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
    const user = await findUser('token', token);

    if (user) {
        res.send({ theme: user.theme });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});
  
// update theme for the players and the overall theme
apiRouter.post('/updateTheme', async (req, res) => {
    const token = req.cookies['token'];
    const user = await findUser('token', token);
    
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
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);

    res.send({ username: user.username });
  }
});

//login
//apiRouter.put('/auth', async (req, res) => {
  // const user = await findUser('username', req.body.username);
  // if (user && (await bcrypt.compare(req.body.password, user.password))) {
  //   setAuthCookie(res, user);

  //   res.send({ username: user.username });
  // } else {
  //   res.status(401).send({ msg: 'Unauthorized' });
  // }
  apiRouter.put('/auth', async (req, res) => {
    const user = await findUser('username', req.body.username);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        await DB.updateUser(user);
        setAuthCookie(res, user.token);
        res.send({ username: user.username });
        return;
      }
    }
    res.status(401).send({ msg: 'Unauthorized' });
  });


// Logout route (fixed)
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// // getme
// apiRouter.get('/user/me', async (req, res) => {
//   const token = req.cookies['token'];
//   console.log("Token from cookie:", token); // Log token
//   const user = await findUser('token', token);

//   if (user) {
//     console.log("Found user:", user); // Log found user
//     res.send({ username: user.username });
//   } else {
//     console.log("User not found");
//     res.status(401).send({ msg: 'Unauthorized' });
//   }
// });

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};


async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// function clearAuthCookie(res, user) {
//   delete user.token;
//   res.clearCookie('token');
// }

// const path = require('path');

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.listen(port, function () {
//   console.log(`Listening on port ${port}`);
// });

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});