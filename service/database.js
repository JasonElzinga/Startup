const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const userCollection = db.collection('user');
const themeCollection = db.collection('choosenTheme');
const nameList = db.collection('listNames');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(username) {
  return userCollection.findOne({ username: username });
}

async function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function deleteAllNameLists() {
  try {
    // Assuming there should only be one document in 'listNames' collection
    const result = await nameList.deleteMany({});
    console.log('Successfully deleted all name lists from the collection');
  } catch (error) {
    console.error('Error deleting all name lists:', error);
    throw new Error('Failed to delete all name lists');
  }
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function setCurrentPlayerState(user, state) {
  await userCollection.updateOne({username: user.username}, { $set: { currentPlayer: state } })
}


async function updateTheme(theme) {
  await themeCollection.updateOne(
    {}, 
    { $set: { theme: theme } }, 
    { upsert: true } 
  );
}

async function getTheme() {
  return await themeCollection.findOne({}); 
}

async function updateThemes(currentTheme) {
  await userCollection.updateMany({}, { $set: { theme: currentTheme.theme } });
}

async function getNameList() {
  try {
    const nameDoc = await nameList.findOne({});

    if (nameDoc && nameDoc.names) {
      return nameDoc.names; 
    } else {
      return []; 
    }
  } catch (error) {
    console.error('Error fetching name list:', error);
    throw new Error('Failed to fetch name list');
  }
}


async function updateNameList(newName) {
  try {
    const nameDoc = await nameList.findOne({});

    if (nameDoc) {
      await nameList.updateOne(
        {},
        { $push: { names: newName } }  
      );
    } else {
      await nameList.insertOne({
        names: [newName],  
      });
    }

    console.log(`Name '${newName}' added`);
  } catch (error) {
    console.error('Error updating name list:', error);
    throw new Error('Failed to update name list');
  }
}


module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateTheme,
  getTheme,
  updateThemes,
  updateNameList,
  getNameList,
  deleteAllNameLists,
  setCurrentPlayerState,
};