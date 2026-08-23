import React from 'react';
import '../../styles/pages.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:3000/api/auth/foodpartner/login", {
      email,
      password
    }, {
      withCredentials: true
    });
    console.log(response.data);
    localStorage.setItem('token', response.data.token || response.data.accessToken);

    navigate("/create-food");
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Food Partner Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="form-button">Login</button>
      </form>
      <div className="form-link">
        <a href="/food-partner/register">Don't have an account? Register</a>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;