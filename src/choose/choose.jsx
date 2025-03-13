import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import "./choose.css"

export function Choose({theme, setTheme, lastTheme}) {
    const [showList, setShowList] = React.useState(false);
    const [viewMessage, setViewMessage] = React.useState("Show List of Names to Everyone")
    const [inputName, setInputName] = React.useState("");
    const [names, setNames] = React.useState([]);

      useEffect(() => {
        (async () => {
          try {
            const res = await fetch('/api/user/me');

            const themeRes = await fetch('/api/theme');
            const themeData = await themeRes.json();
            setTheme(themeData.theme);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        })();
      }, []);


    function updateViewMessage() {
        if (viewMessage == "Show List of Names to Everyone"){
            setViewMessage("Hide List of Names for Everyone")
        }
        else {
            setViewMessage("Show List of Names to Everyone")
        }
    }

    function viewList() {
        if (showList !== false) {
            setShowList(false)
        }
        else {
            setShowList(true)
        }
        updateViewMessage()
    }

    useEffect(() => {
        setTheme(localStorage.getItem('theme'));
    }, []);


    React.useEffect(() => {
        
    })

    function updateName(e) {
        setInputName(e.target.value)
        localStorage.setItem("name", e.target.value)
    }

    function addName() {
        const newName = {
            name: inputName.trim()
        }
        const updatedNames = [...names, newName];
        setNames(updatedNames);
        localStorage.setItem("listNames", JSON.stringify(updatedNames));

        setInputName("");
    }

    function restartGame() {
        setNames([])
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            const names = [
                'Bill Clinton', 'Leonardo DiCaprio', 'Oprah Winfrey', 'Barack Obama', 'Albert Einstein',
                'Elon Musk', 'Beyoncé', 'Taylor Swift', 'Michael Jordan', 'Serena Williams',
                'Morgan Freeman', 'Steve Jobs', 'Walt Disney', 'Marilyn Monroe',
                'Tom Hanks', 'Emma Watson', 'David Bowie', 'Freddie Mercury', 'Keanu Reeves',
                'Mark Zuckerberg', 'Jennifer Aniston', 'Dwayne Johnson', 'Gordon Ramsay',
                'Shakira', 'Cristiano Ronaldo', 'LeBron James', 'Adele', 'Stephen King',
                'J.K. Rowling', 'Vin Diesel', 'Kanye West', 'Lady Gaga', 'Will Smith',
                'Zendaya', 'Bruno Mars', 'Harrison Ford', 'Johnny Depp', 'Angelina Jolie',
                'Scarlett Johansson', 'Robert Downey Jr.', 'Meryl Streep', 'Cillian Murphy',
                'Ryan Reynolds', 'Chris Hemsworth', 'Gal Gadot', 'Denzel Washington', 'Jim Carrey'
            ];

        const randomName = {
            name: names[Math.floor(Math.random() * names.length)],
        };

        setNames(prevNames => [...prevNames, randomName]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return (
        <main>
            <div className="theme-title">
                <h2>Theme: {theme}</h2>
            </div>
            {/* <form method="post"> */}
                <div className="theme-div">
                    <div className="input-group">
                        <span className="input-group-text bg-warning text-dark"><i className="bi bi-palette"></i></span>
                        <input type="text" onChange={updateName} className="form-control" placeholder="Enter your name!" required></input>
                        <button onClick={addName}className="btn btn-primary">Submit</button>
                    </div>
                </div>
            {/* </form> */}
            <div className="button-container">
                <button onClick={viewList} className="btn btn-success">
                    {viewMessage}
                </button>
                <button onClick={restartGame}className="btn btn-danger">Reset Game</button>
            </div>
            
            
            {showList && (
                <div className="name-list-container p-4 shadow-lg">
                    <h3>List of Names!</h3>
                    <ul className="list-group">
                    {names.map((nameObj, index) => (
                        <li key={index} className="list-group-item d-flex align-items-center">
                            {nameObj.name}
                        </li>
                    ))}
                </ul>
                </div>
            )}
            <hr></hr>
        </main>
    );
}
