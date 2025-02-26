import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import "./choose.css"

export function Choose({theme, setTheme}) {


    useEffect(() => {
        setTheme(localStorage.getItem('theme') || "Famous People");
    }, []);

    return (
        <main>
            <div className="theme-title">
                <h2>Theme: {theme}</h2>
            </div>
            <form method="post">
                <div className="theme-div">
                    <div className="input-group">
                        <span className="input-group-text bg-warning text-dark"><i className="bi bi-palette"></i></span>
                        <input type="text" className="form-control" placeholder="Enter your name!" required></input>
                        <button className="btn btn-primary">Submit</button>
                    </div>
                </div>
                <div className="button-container">
                    <button className="btn btn-secondary" style={{ backgroundColor: 'rgb(167, 76, 43)' }}>
                        View List of Names
                    </button>
                    <button className="btn btn-success">We have a Winner!</button>
                    <button className="btn btn-danger">Reset Game</button>
                </div>
            </form>
            

            <div className="name-list-container p-4 shadow-lg">
                <h3>List of Names!</h3>
                <ul className="list-group">
                    <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-person-circle me-2 text-primary"></i> Leonardo DiCaprio
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-person-circle me-2 text-success"></i> Bill Clinton
                    </li>
                    <li className="list-group-item d-flex align-items-center">
                        <i className="bi bi-person-circle me-2 text-danger"></i> MrBeast
                    </li>
                </ul>
            </div>
            <hr></hr>
        </main>
    );
}