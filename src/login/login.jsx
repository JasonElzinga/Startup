import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({setUser}) {
    
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');

    function loginUser() {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

        const foundUser = storedUsers.find(user => user.username == username && user.password == password);

        if (foundUser) {
            localStorage.setItem('user', username);
            setUser(username);
            navigate('/Play')
            return;
        }
        else {
            alert("Invalid username and password. Create an account if you haven't already done so or try again.");
        }

    }

    function usernameChange(e) {
        setUsername(e.target.value);
        localStorage.setItem("user", e.target.value)
    }

    const [users, setUsers] = React.useState(() => {
        return JSON.parse(localStorage.getItem("users")) || [];
    });

    const [password, setPassword] = React.useState("");

    function passwordChange(e) {
        setPassword(e.target.value);
        localStorage.setItem("password", e.target.value);
    }


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
                    <form>
                        <div className="mb-3">
                            <label htmlFor="text" className="form-label">User Name</label>
                            <input type="text" className="form-control" onChange={usernameChange} id="username" placeholder="Enter your username" required></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" onChange={passwordChange} id="password" placeholder="Enter your password" required></input>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button onClick={loginUser} type="submit" className="btn btn-primary w-50 me-2">Login</button>
                            <button onClick={handleAddUser}type="button" className="btn btn-outline-secondary w-50">Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

