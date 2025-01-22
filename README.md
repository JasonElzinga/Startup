# Your startup name here
>  The Name Game

[My Notes](notes.md)

>  This application will allow users to play the "Name game" without the need of paper or someone to lead and not play the game. It will track how many times someone has won and the last themes that each person played with. 

>  In the game, everyone writes down a word from a certain theme (ex. actors, household items or just names in general). Then each player will have time to read the list of different words. The goal of the game is to remember each word and figure out who put down which word. Players take turns asking someone if they wrote down a certain word and goes until everyone but one were guessed. When you guess right then you form a team with that person and keep guessing until you guess incorrectly.

## 🚀 Specification Deliverable

> [!NOTE]
>  Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] Proper use of Markdown
- [X] A concise and compelling elevator pitch
- [X] Description of key features
- [X] Description of how you will use each technology
- [X] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

>  Have you ever played the Name Game? It is a party game that is fun for groups of all sizes and ages. Everyone writes down a word from a
certain theme and gives it to the person in charge. This person will then read off the words. The goal of the game is to remember each word and figure out who put down which word! Normally there is someone who moniters the game and can't play but those days are long gone with this new application! Now everyone can play and there isn't even a need to get paper out! So get with your friends, hop on, and enjoy a evening full of laughter and fun!

### Design

![Design1](Design1.png)
![Design2](Design2.png)
![Design3](Design3.png)


### Key features

- Secure login over HTTPS
- Play the Name Game without paper or dedicated leader
- Ability to see how many wins each player has
- Ability to choose the theme each game
- Ability to input the winner
- Ability to see what theme each player played with last
- Ability for the whole group to look at all the names for however long the group decides
- Ability to see a random English Word each game


### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for applicaction. One for the login, one for the waiting for players page, one for inputing the word, one for the list of words, and one for the play again option and adding the winner.
- **CSS** - Adaptive application styling that will look simple and clean on all sizes.
- **React** - Accepts input for the theme, what words each person wants as their name, and who won the game. Also allows for logining in and changes screen based on point of the game.
- **Service** - Save/retrieve the game wins of each player and the last used theme for each player. Also it will use a third party to display a random English word.
- **DB/Login** - Stores users, user wins, the user's word, and the last theme that each user played with in database. No one can play the Name Game unless they first make an account.
- **WebSocket** - Takes all names inputed and displays a list of them to all players. Also as players join the game the player list will be updated.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Server deployed and accessible with custom domain name** - [My server link](https://thenamegame.click/).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **HTML pages** - I did not complete this part of the deliverable.
- [ ] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [ ] **Links** - I did not complete this part of the deliverable.
- [ ] **Text** - I did not complete this part of the deliverable.
- [ ] **3rd party API placeholder** - I did not complete this part of the deliverable.
- [ ] **Images** - I did not complete this part of the deliverable.
- [ ] **Login placeholder** - I did not complete this part of the deliverable.
- [ ] **DB data placeholder** - I did not complete this part of the deliverable.
- [ ] **WebSocket placeholder** - I did not complete this part of the deliverable.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Header, footer, and main content body** - I did not complete this part of the deliverable.
- [ ] **Navigation elements** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing** - I did not complete this part of the deliverable.
- [ ] **Application elements** - I did not complete this part of the deliverable.
- [ ] **Application text content** - I did not complete this part of the deliverable.
- [ ] **Application images** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - Routing between login and voting components.

## 🚀 React part 2: Reactivity

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.

## 🚀 DB/Login deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **User registration** - I did not complete this part of the deliverable.
- [ ] **User login and logout** - I did not complete this part of the deliverable.
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Restricts functionality based on authentication** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
