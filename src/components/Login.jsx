import React, { useContext, useState } from 'react';
import authContext from '../context/authentication/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const context = useContext(authContext);
  const { loginUser } = context;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    switch (name) {
      case 'email':
        setEmailError('');
        setEmail(value);
        break;

      default:
        break;
    }
    switch (name) {
      case 'password':
        setPasswordError('');
        setPassword(value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    if (email.length === 0) {
      setEmailError('Email cannot be empty');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a Valid Email');
      isValid = false;
    }
    if (password.length === 0) {
      setPasswordError('Password cannot be empty');
      isValid = false;
    } else if (password.length < 5) {
      setPasswordError('Password must be atleast of 5 characters');
      isValid = false;
    }
    if (isValid) {
      loginUser(email, password, navigate);
    }
  };

  return (
    <div className="container my-3">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <p style={{ color: '#bf2d31', fontWeight: '500' }}>{emailError}</p>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>
        <p style={{ color: '#bf2d31', fontWeight: '500' }}>{passwordError}</p>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;