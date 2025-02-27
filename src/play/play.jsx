import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './play.css';

export function Play({user}) {
  const navigate = useNavigate();

  const [index, setIndex] = React.useState(0);
  const [randomWord, setRandomWord] = React.useState("Epic")

  const randomWords = [
    "apple", "bicycle", "cloud", "dragon", "elephant", "forest", "galaxy", "horizon", "igloo", "jungle",
    "kangaroo", "lighthouse", "mountain", "nebula", "ocean", "pyramid", "quasar", "rainbow", "satellite", "tornado",
    "umbrella", "volcano", "whisper", "xylophone", "yacht", "zeppelin", "avocado", "backpack", "cactus", "dolphin",
    "emerald", "firefly", "glacier", "harbor", "island", "jigsaw", "koala", "labyrinth", "meteor", "nocturnal",
    "octopus", "penguin", "quicksand", "rhinoceros", "sunflower", "treasure", "underwater", "vortex", "waterfall", "xenon",
    "yogurt", "zeppelin", "anchor", "blizzard", "candle", "desert", "echo", "fossil", "gondola", "horizon",
    "illuminate", "javelin", "kaleidoscope", "lullaby", "marathon", "nectar", "obsidian", "parachute", "quest", "ripple",
    "silhouette", "telescope", "utopia", "voyager", "wilderness", "xenophobia", "yonder", "zenith", "amethyst", "blueprint",
    "cascade", "delirium", "enigma", "fjord", "gadget", "halcyon", "inertia", "jubilant", "karma", "luminescent",
    "mosaic", "nirvana", "oracle", "paradox", "quintessence", "resonance", "serendipity", "tranquil", "unison", "whimsical"
  ];

  const [players, setPlayers] = useState([]);
  const themes = ["Movies", "Sports", "History", "Music", "Science"];
  const [lastTheme, setLastTheme] = React.useState("Famous People")

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

  const [choosenTheme, setChoosenTheme] = React.useState("Famous People");

  function changeChoosenTheme(e) {
    setChoosenTheme(e.target.value);
    localStorage.setItem('theme', e.target.value);
  }


  function randomWordFunction() {
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex +1) % randomWords.length);
      }, 2000);

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      setRandomWord(randomWords[index])
    }, [index]);

    return randomWord;
  }

  function handleReadyButton(e) {
      localStorage.setItem("theme", choosenTheme)
      navigate('/choose')
  }
    

  return (
    <main className='bg-secondary text-light'>
      <div className="container my-1">
        <div className="img-container">
          <h2 className="title">Players</h2>
          <img src="/MagnifyingGlass.png" alt="Magnifying Glass" />
        </div>
        <table className="table table-striped table-bordered table-hover shadow-lg">
          <thead className="table-dark">
            <tr>
              <th>Player</th>
              <th>Last Theme</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user}</td>
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
        <p>Random Word: {randomWordFunction()}</p>
      </div>
    </main>
  );
}
