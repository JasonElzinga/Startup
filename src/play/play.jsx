import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './play.css';
// import 'index.js';

export function Play({user, lastTheme, setLastTheme}) {
  const navigate = useNavigate();

  const [index, setIndex] = React.useState(0);
  const [userInfo, setUserInfo] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const res = await fetch('api/user/me');
      const data = await res.json();
      setUserInfo(data);
    })();
   }, []);

  const [players, setPlayers] = useState([]);
  const themes = ["Movies", "Sports", "History", "Music", "Science"];
  const [choosenTheme, setChoosenTheme] = React.useState("Famous People");

  useEffect(() => {
    const interval = setInterval(() => {
      const fakeNames = ['Toby', 'Paul', 'Ashley', 'Jason', 'Samantha', 'Chris'];
  
      const randomPlayer = {
        name: fakeNames[Math.floor(Math.random() * fakeNames.length)],
        theme: themes[Math.floor(Math.random() * themes.length)]
      };
  
      setPlayers(prevPlayers => [...prevPlayers, randomPlayer]);
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);


  function changeChoosenTheme(e) {
    setChoosenTheme(e.target.value);
    localStorage.setItem('theme', e.target.value);
  }


  const [randomWord, setRandomWord] = useState("loading...");
  // api 3rd party call to fetch random word everytime you reload the page.
  useEffect(() => {
    fetch("https://random-word-api.herokuapp.com/word")
      .then((response) => response.json())
      .then((data) => {
        setRandomWord(data[0]);
      })
      .catch((error) => {
        console.error("Error fetching word:", error);
        setWord("Failed to load word");
      });
  }, []);

  function handleReadyButton(e) {
    localStorage.setItem("theme", choosenTheme)
    setLastTheme(choosenTheme)
    localStorage.setItem("lastTheme", choosenTheme)
    navigate('/choose')
  }
    

  return (
    <main className='bg-secondary text-light'>
      <div className="container my-1">
        <div className="img-container">
          <h2 className="title">Players</h2>
          <img src="/MagnifyingGlass.png" alt="Magnifying Glass" />
        </div>
        <div>
          <br/>
          <table className="table table-striped table-bordered table-hover shadow-lg">
            <thead className="table-dark">
              <tr>
                <th>Player</th>
                <th>Last Theme</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userInfo.username}</td>
                <td>{lastTheme}</td>
              </tr>
              {players.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{player.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="theme-div">
        <div className="mb-3">
          <p style={{ textAlign: 'center' }}>Current Theme: {choosenTheme}</p>
          <input type="text" className="button-theme" onChange={changeChoosenTheme} placeholder="Enter your theme" required />
          <button
            onClick={handleReadyButton}
            className="btn btn-primary w-50 me-2"
            style={{ backgroundColor: 'rgb(57, 43, 151)' }}>
            Click When Everyone is Ready
          </button>
        </div>
      </div>
      <div style={{ padding: '0px' }}>
        <p>Random Word: {randomWord}</p>
      </div>
    </main>
  );
}
