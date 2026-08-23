import React from 'react';
import '../../styles/pages.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const restaurantName = e.target.restaurantName.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const restaurantAddress = e.target.restaurantAddress.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:3000/api/auth/foodpartner/register", {
      name: restaurantName,
      email,
      Phone: phone,
      Address: restaurantAddress,
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
      <h1 className="form-title">Food Partner Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="restaurantName">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              className="form-input"
              placeholder="Enter restaurant name"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              className="form-input"
              placeholder="Enter phone number"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="restaurantAddress">Restaurant Address</label>
            <input
              type="text"
              id="restaurantAddress"
              className="form-input"
              placeholder="Enter restaurant address"
            />
          </div>
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
        <button type="submit" className="form-button">Register</button>
      </form>
      <div className="form-link">
        <a href="/food-partner/login">Already have an account? Login</a>
      </div>
      <div className="form-link">
        <a href="/user/register">Register as User instead?</a>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;