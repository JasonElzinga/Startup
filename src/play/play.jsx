import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './play.css';


export function Play({user, setUser, lastTheme, setLastTheme}) {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState('');

  const fetchCurrentPlayers = async (temp_user) => {
    console.log("this is : ", temp_user);
    try {
      console.log("Fetching current players for:", temp_user);
      const res = await fetch(`/api/currentPlayers?user=${encodeURIComponent(temp_user)}`, {
        credentials: 'include'
      });
  
      if (!res.ok) throw new Error("Failed to fetch current players");
      const data = await res.json();
      setPlayers(data.players);
    } catch (error) {
      console.error("Error fetching current players:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Fetch user data
        const res = await fetch('/api/user/me', { credentials: 'include' }); // Ensure credentials are included
        if (!res.ok) throw new Error("Failed to fetch user");
  
        const data = await res.json();
        
        setUser(data.username);
        setUserInfo(data);
        console.log(data.username);
        fetchCurrentPlayers(data.username);
  
        // Fetch user theme
        const themeRes = await fetch('/api/usertheme', { credentials: 'include' });
        if (!themeRes.ok) throw new Error("Failed to fetch theme");
  
        const themeData = await themeRes.json();
        setLastTheme(themeData.theme || "First Time!");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
    })();
  }, []);

  const [sockets, setSocket] = useState(null);

  React.useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    let port = window.location.port;
    const socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    setSocket(socket);
    
    socket.onopen = () => {
      socket.send({ type: 'playerUpdate' })
    }

    socket.onmessage = (event) => {
      console.log("Working")
      const message = JSON.parse(event.data);
      if (message.type === 'playerUpdate') {
        fetchCurrentPlayers(user);  // reload player list
      }
      else if (message.type === 'switch') {
        console.log("going to navigate");
        navigate('/choose');
      }
      console.log("checked the messages");
      console.log("here is the message type:", message.type)
    };
  
    return () => {
      socket.close();
    };
  }, [user]);


  const [players, setPlayers] = useState([]);
  const [choosenTheme, setChoosenTheme] = React.useState("Famous People");


  function changeChoosenTheme(e) {
    setChoosenTheme(e.target.value);
    localStorage.setItem('theme', e.target.value);
  }

  const [randomWord, setRandomWord] = useState("Loading...");


  // api 3rd party call to get the random word
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

  async function handleReadyButton() {
    setLastTheme(choosenTheme);
    sockets.send(JSON.stringify({ type: 'switch' }));

    try {
      const res = await fetch('/api/updateTheme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ theme: choosenTheme }),
      });

      if (!res.ok) throw new Error("Failed to update theme");
    } catch (error) {
      console.error("Error updating theme:", error);
    }
    navigate('/choose');
  }

  useEffect(() => {
    if (lastTheme) {
      setChoosenTheme(lastTheme);  
    }
  }, [lastTheme]);
    

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
                  <td>{player.username}</td>
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
