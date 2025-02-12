import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Play } from './play/play';
import { Choose } from './choose/choose';
import { About } from './about/about';


export default function App() {
  return (
        <BrowserRouter>
            <div>
                <header className="container-fluid">
                    <div className="w-100">
                        <nav>
                            <div className="nav-name">
                                <span>The Name Game!</span>
                            </div>
                            <div className="nav-item">
                                <NavLink className="nav-link" to="Login">Login</NavLink>
                                <NavLink className="nav-link" to="Choose">Play</NavLink>
                                <NavLink className="nav-link" to="About">About</NavLink>
                            </div>
                        </nav>
                    </div>
                </header>
                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/play' element={<Play />} />
                    <Route path='/scores' element={<Choose />} />
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