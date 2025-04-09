import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './choose.css';

export function Choose({ theme, setTheme, lastTheme }) {
  const [showList, setShowList] = React.useState(false);
  const [viewMessage, setViewMessage] = React.useState('Show List of Names to Everyone');
  const [inputName, setInputName] = React.useState('');
  const [names, setNames] = React.useState([]);

  useEffect(() => {
    (async () => {
      try {
        const themeRes = await fetch('/api/theme');
        if (!themeRes.ok) throw new Error('Failed to fetch theme');
        const themeData = await themeRes.json();
        setTheme(themeData.theme);

        const namesRes = await fetch('/api/names');
        if (!namesRes.ok) throw new Error('Failed to fetch names');
        const namesData = await namesRes.json();
        setNames(namesData.names || []);  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, [setTheme]);

  // Toggle visibility of the name list and update view message
  const updateViewMessage = () => {
    if (viewMessage === 'Show List of Names to Everyone') {
      setViewMessage('Hide List of Names for Everyone');
    } else {
      setViewMessage('Show List of Names to Everyone');
    }
  };


    const getListNames = async () => {
      try {
        const namesRes = await fetch('/api/names');
        if (!namesRes.ok) {
            setNames([]);
        }
        const namesData = await namesRes.json();
        setNames(namesData || []);  
        console.log("Here is the data", namesData);
      } catch (error) {
        console.error('Error fetching names:', error);
      }
    };


  const viewList = async () => {
    try {
      setShowList((prevState) => !prevState);  

      
      getListNames()
      updateViewMessage(); 
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  const updateName = (e) => {
    setInputName(e.target.value);
    localStorage.setItem('name', e.target.value);
  };




  const updateListNamesHelper = async (newName) => {
    try {
      const res = await fetch('/api/updateNames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newName }), 
      });

      if (!res.ok) {
        throw new Error('Failed to update names');
      }

      console.log('Name updated successfully');
    } catch (error) {
      console.error('Error updating names:', error);
    }
  };


  const addName = () => {
    const newName = inputName.trim();
    if (!newName) return;


    updateListNamesHelper(newName);  
    setInputName('');  
    getListNames();
  };

  // Reset the game by clearing the names from the backend
  const restartGame = async () => {
    try {
      const res = await fetch('/api/deleteNames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete names in the database');
      }

      setNames([]);  
      console.log('Game restarted and names deleted from the database');
    } catch (error) {
      console.error('Error restarting the game:', error);
    }
  };

  return (
    <main>
      <div className="theme-title">
        <h2>Theme: {theme}</h2>
      </div>
      <div className="theme-div">
        <div className="input-group">
          <span className="input-group-text bg-warning text-dark">
            <i className="bi bi-palette"></i>
          </span>
          <input
            type="text"
            onChange={updateName}
            className="form-control"
            placeholder="Enter your name!"
            required
            value={inputName}
          />
          <button onClick={addName} className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>

      <div className="button-container">
        <button onClick={viewList} className="btn btn-success">
          {viewMessage}
        </button>
        <button onClick={restartGame} className="btn btn-danger">
          Reset Game
        </button>
      </div>

      {showList && (
        <div className="name-list-container p-4 shadow-lg">
          <h3>List of Names!</h3>
          <ul className="list-group">
          {names.length > 0 ? (
              names.map((name, index) => (
                <li key={index} className="list-group-item d-flex align-items-center">
                  {name}
                </li>
              ))
            ) : (
              <li className="list-group-item d-flex align-items-center text-center">
                No names available
              </li>
            )}
          </ul>
        </div>
      )}
      <hr />
    </main>
  );
}
