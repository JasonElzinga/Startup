import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({setUser}) {
    const navigate = useNavigate();
    const [text, setText] = React.useState('');

    function loginUser(e) {
        localStorage.setItem('user', text);
        setUser(text);
        navigate('/Play')
    }

    function textChange(e) {
        setText(e.target.value);
    }


    return (
        <main>
            <div className="container">
                <div className="login-container">
                    
                    <h2>Login</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="text" className="form-label">User Name</label>
                            <input type="text" className="form-control" onChange={textChange} id="email" placeholder="Enter your username" required></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Enter your password" required></input>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button onClick={loginUser} type="submit" className="btn btn-primary w-50 me-2">Login</button>
                            <button type="button" className="btn btn-outline-secondary w-50">Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

