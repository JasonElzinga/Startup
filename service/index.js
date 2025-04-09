const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const { getTheme, updateTheme } = require('./database'); 
const { peerProxy } = require('./peerProxy.js');

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

const authCookieName = 'token'

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const wss = peerProxy(httpService);


//console.log('WebSocket server initialized:', wss);


// Fetch the list of chosen names from the database
apiRouter.get('/names', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await DB.findUser('token', token);  

    if (user) {
      const themeDoc = await DB.getThemeByUserToken(token);  

      if (themeDoc && themeDoc.names) {
        res.send({ listNames: themeDoc.names });
      } else {
        res.send({ listNames: [] }); 
      }
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error fetching names:', error);
    res.status(500).send({ msg: 'Server error' });
  }
});

// Update the list of chosen names in the database
apiRouter.post('/updateNames', async (req, res) => {
  try {
    const token = req.cookies['token'];
    const user = await findUser('token', token); 

    if (user && req.body.newName) {  
      const newName = req.body.newName;  
      await DB.updateNameList(newName);  
      res.send({ msg: 'Name updated successfully' });
    } else {
      res.status(400).send({ msg: 'Invalid request, name is required' });
    }
  } catch (error) {
    console.error('Error updating names:', error);
    res.status(500).send({ msg: 'Server error' });
  }
});

apiRouter.post('/deleteNames', async (req, res) => {
  try {
    await DB.deleteAllNameLists();

    res.send({ msg: 'All name lists deleted successfully' });
  } catch (error) {
    console.error('Error deleting name lists:', error);
    res.status(500).send({ msg: 'Failed to delete all name lists' });
  }
});


apiRouter.get('/theme', async (req, res) => {
  try {
    const themeData = await getTheme();
    res.send({ theme: themeData ? themeData.theme : 'First Time!' });
  } catch (error) {
    console.error("Error fetching theme:", error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// Update theme for the user in the database
apiRouter.post('/updateTheme', async (req, res) => {
  try {
    if (!req.body.theme) {
      return res.status(400).send({ msg: 'Invalid request' });
    }

    await updateTheme(req.body.theme);

    const currentTheme = await getTheme();  

    if (!currentTheme || !currentTheme.theme) {
      return res.status(500).send({ msg: 'Current theme not found' });
    }

    DB.updateThemes(currentTheme);

    res.send({ msg: 'Theme updated for all users', theme: currentTheme.theme });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// get user theme
apiRouter.get('/usertheme', async (req, res) => {
  try {
    const token = req.cookies[authCookieName]; 
    console.log("Token from cookie:", token); 

    if (!token) {
      console.log("No token found");
      return res.status(401).send({ msg: 'Unauthorized' });
    }

    // Fetch the user from the database using the token
    const user = await DB.getUserByToken(token);

    if (!user) {
      console.log("User not found");
      return res.status(401).send({ msg: 'Unauthorized' });
    }

    // Log found user and theme
    console.log("Found user:", user);
    
    // Return the user's theme or default to 'First Time!' if no theme is set
    res.send({ theme: user.theme || 'First Time!' });
  } catch (error) {
    console.error("Error fetching user theme:", error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// create account
apiRouter.post('/auth', async (req, res) => {
  if (await findUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);

    //wss.broadcast({ type: 'playerUpdate' });

    res.send({ username: user.username });
  }
});

// login
apiRouter.put('/auth', async (req, res) => {
    const user = await findUser('username', req.body.username);
    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        await DB.updateUser(user);
        await DB.setCurrentPlayerState(user, true);
        setAuthCookie(res, user.token);

        //wss.broadcast({ type: 'playerUpdate' });
        

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
    user.token = null;
    await DB.updateUser(user);
    await DB.setCurrentPlayerState(user, false);

    //wss.broadcast({ type: 'playerUpdate' });
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/currentPlayers', async (req, res) => {
  try {
    const currentUser = req.query.user;
    const currentPlayers = await DB.sendCurrentPlayerList(currentUser);  
    console.log("Players: ", {players: currentPlayers});
    res.send({ players: currentPlayers });
  } catch (error) {
    console.error("Error fetching current players:", error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// getme
apiRouter.get('/user/me', async (req, res) => {
  try {
    const token = req.cookies[authCookieName]; 
    console.log("Token from cookie:", token);
    if (!token) {
      console.log("No token found");
      return res.status(401).send({ msg: 'Unauthorized' });
    }

    const user = await DB.getUserByToken(token); 

    if (user) {
      console.log("Found user:", user); 
      res.send({ username: user.username });
    } else {
      console.log("User not found");
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ msg: 'Server error' });
  }
});


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
    theme: "First Time!",
    token: uuid.v4(),
    currentPlayer: true,
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



