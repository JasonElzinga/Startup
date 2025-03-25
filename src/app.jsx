import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Choose } from './choose/choose';
import { About } from './about/about';


export default function App() {
    const [user, setUser] = React.useState(localStorage.getItem('user') || null);
    const [lastTheme, setLastTheme] = React.useState(localStorage.getItem('lastTheme') || "First Game!");
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || "Famous People");
    //const navigate = useNavigate();

    React.useEffect(() => {
        localStorage.setItem('theme', theme); 
        setLastTheme(lastTheme);
        localStorage.setItem('lastTheme', lastTheme); 
    }, [theme]);
    

    function LogoutButton({ setUser, navigate }) {
        const handleLogout = async () => {
            try {
                const response = await fetch('/api/auth', {
                    method: 'DELETE',
                    credentials: 'include', // Include cookies (session or token)
                });
    
                if (response.ok) {
                    console.log('User logged out');
                    setUser(null); // Clear user state on logout
                    localStorage.removeItem('user');
                } else {
                    console.error('Failed to log out');
                }
            } catch (error) {
                console.error('Error logging out:', error);
            }
        };
    
        return (
            <button className="nav-link" onClick={handleLogout}>
                Logout
            </button>
        );
    }


    return (
        <BrowserRouter>
            <div className='body bg-secondary text-light'>
                <header className="container-fluid">
                    <div className="w-100">
                        <nav>
                            <div className="nav-name">
                                <span>The Name Game!</span>
                            </div>
                            <div className="nav-item">
                                {user && <NavLink className="nav-link" to="/">Logout</NavLink>}
                                {!user && <NavLink className="nav-link" to="/">Login</NavLink>}
                                {user && <NavLink className="nav-link" to="/play">Play</NavLink>}
                                <NavLink className="nav-link" to="/about">About</NavLink>
                            </div>
                        </nav>
                    </div>
                </header>
                <Routes>
                    <Route path='/' element={<Login setUser={setUser}/>} exact />
                    <Route path='/play' element={<Play user={user} setUser = {setUser} lastTheme={lastTheme} setLastTheme={setLastTheme}/>} />
                    <Route path='/choose' element={<Choose theme={theme} setTheme={setTheme} lastTheme={lastTheme}/>} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <footer>
                    <hr></hr>
                    <span>Made by Jason Elzinga</span>
                    <br/>
                    <NavLink to="https://github.com/JasonElzinga/Startup.git">GitHub Repository</NavLink>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

