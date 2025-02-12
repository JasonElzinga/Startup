import React from 'react';
import { useNavigate } from 'react-router-dom';
import './play.css';
import Button from 'react-bootstrap/Button';

export function Play() {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <main>
      <div className="container my-1">
        <div className="img-container">
          <h2 className="title">Players</h2>
          <img src="/MagnifyingGlass.png" alt="Magnifying Glass" />
        </div>
        <table className="table table-striped table-bordered table-hover shadow-lg">
          <thead className="table-dark">
            <tr>
              <th>Player</th>
              <th>Wins</th>
              <th>Last Theme</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jason</td>
              <td>3</td>
              <td>Fruit</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>0</td>
              <td>None</td>
            </tr>
            <tr>
              <td>Toby</td>
              <td>7</td>
              <td>Famous People</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="theme-div">
        <div className="mb-3">
          <p style={{ textAlign: 'center' }}>Current Theme: Famous People</p>
          <input type="text" className="button-theme" placeholder="Enter your theme" required />
          <button
            onClick={() => navigate('/choose')}
            className="btn btn-primary w-50 me-2"
            style={{ backgroundColor: 'rgb(57, 43, 151)' }}
          >
            Click When Everyone is Ready
          </button>
        </div>
      </div>
      <div style={{ padding: '0px' }}>
        <p>Random Word: Tail</p>
      </div>
    </main>
  );
}
