import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({setUser}) {
    
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleLogin() {
        createAuth('put');
    }
    
      function handleRegister() {
        createAuth('post');
    }
    
    async function createAuth(method) {
        const res = await fetch('api/auth', {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
          const username = data.username;
          console.log("logged in as:", username)
          navigate('/play');
        } else {
          alert('Authentication failed');
        }
    }
    


    const [users, setUsers] = React.useState(() => {
        return JSON.parse(localStorage.getItem("users")) || [];
    });


    function handleAddUser() {
        if (!username || !password) {
            alert("Please enter a username and password.");
            return;
        }

        if (users.some(user => user.username === username)) {
            alert("Username already exists. Choose a different one.");
            return;
        }

        const newUser = { username, password };
        setUsers([...users, newUser]);
        alert("Acount made! Now you can login!")

    }

    React.useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    return (
        <main>
            <div className="container">
                <div className="login-container">
                    
                <h2>Login</h2>
                    <div className="mb-3">
                        <label htmlFor="text" className="form-label">Username</label>
                        <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} id="username" placeholder="Enter your username" required></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" required></input>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button onClick={handleLogin} disabled={!(username && password)} type="submit" className="btn btn-primary w-50 me-2">Login</button>
                        <button onClick={handleRegister}type="button" disabled={!(username && password)} className="btn btn-outline-secondary w-50">Create Account</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

