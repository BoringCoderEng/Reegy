import '../../styles/pages.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;
    const password = e.target.password.value;
    console.log("Data being sent:", {
      FullName: name,
      email,
      password,
      Phone: phone,
      Address: address  
    });
    try {
    const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
            FullName: name,
            email: email,
            password: password,
            Phone: phone,
            Address: address
        },
        {
            withCredentials: true
        }

    );
    localStorage.setItem('token', response.data.token || response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate("/");
  } 
  catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("MESSAGE:", error.message);
  }
};

  
  return (
    <div className="form-container">
      <h1 className="form-title">User Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-input"
              placeholder="Enter your full name"
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
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              className="form-input"
              placeholder="Enter your address"
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
        <a href="/user/login">Already have an account? Login</a>
      </div>
      <div className="form-link">
        <a href="/food-partner/register">Register as Food Partner instead?</a>
      </div>
    </div>
  );
};

export default UserRegister;