import React from 'react';

export function Login() {
  return (
    <main>
        <div className="container">
            <div className="login-container">
                <h2>Login</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter your email" required></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Enter your password" required></input>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary w-50 me-2">Login</button>
                        <button type="button" className="btn btn-outline-secondary w-50">Create Account</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
  );
}