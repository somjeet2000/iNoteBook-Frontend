import React, { useState, useContext, useEffect } from 'react';
import authContext from '../context/authentication/AuthenticationContext';
import alertContext from '../context/alert/AlertContext';
import { Link, useNavigate } from 'react-router-dom';
import Alert from './Alert';

const Signup = () => {
  const [userName, setUserName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // Added for the functionality of forgot password -- Start --
  const [securityQuestion, setSecurityQuestion] = useState(
    "What is your mother's maiden name?"
  );
  const [securityQuestionError, setSecurityQuestionError] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [securityAnswerError, setSecurityAnswerError] = useState('');
  // Added for the functionality of forgot password -- End --
  const context = useContext(authContext);
  const { registerUser, getUserData } = context;
  const context2 = useContext(alertContext);
  const { alert, showAlert } = context2;
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [securityAnswerVisible, setSecurityAnswerVisible] = useState(false);

  const togglePasswordVisibility = () => {
    if (password.length !== 0) {
      setPasswordVisible(!passwordVisible);
    }
  };

  const toggleSecurityAnswerVisibility = () => {
    if (securityAnswer.length !== 0) {
      setSecurityAnswerVisible(!securityAnswerVisible);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'userName':
        setNameError('');
        setUserName(value);
        break;

      default:
        break;
    }
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
    // Added for the functionality of forgot password
    switch (name) {
      case 'securityQuestion':
        setSecurityQuestionError('');
        setSecurityQuestion(value);
        break;

      default:
        break;
    }

    switch (name) {
      case 'securityAnswer':
        setSecurityAnswerError('');
        setSecurityAnswer(value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression for password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    let isValid = true;
    if (userName.length === 0) {
      setNameError('Name cannot be empty');
    }
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
    } else if (password.length < 8) {
      setPasswordError('Password must be atleast of 8 characters');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.'
      );
      isValid = false;
    }
    // Added for the functionality of forgot password
    if (securityQuestion.length === 0) {
      setSecurityQuestionError('You need to select atleast one question');
      isValid = false;
    }
    if (securityAnswer.length === 0) {
      setSecurityAnswerError('Answer should not be blank');
      isValid = false;
    }
    if (isValid) {
      showAlert('Please wait! Redirecting to home...', 'info');
      const registerSuccess = await registerUser(
        userName,
        email,
        password,
        securityQuestion,
        securityAnswer,
        navigate
      );
      if (registerSuccess) {
        await getUserData();
        showAlert('User created successfully', 'success');
      }
    }
  };

  /*
  Fixing the bug where if the user already authentication, it still allows to redirect to login/register, which shouldn't be possible.
  */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Alert alert={alert} />
      <div className='container mt-4'>
        <div
          className='card p-4 shadow-sm'
          style={{ maxWidth: '500px', margin: 'auto' }}
        >
          <h3 className='text-center'>Register Yourself 🤞</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='exampleInputName1' className='form-label'>
                Name
              </label>
              <input
                type='text'
                name='userName'
                value={userName}
                onChange={handleChange}
                className='form-control'
                id='exampleInputName1'
                aria-describedby='emailHelp'
              />
            </div>
            <p style={{ color: '#bf2d31', fontWeight: '500' }}>{nameError}</p>
            <div>
              <label htmlFor='exampleInputEmail1' className='form-label'>
                Email address
              </label>
              <input
                type='text'
                name='email'
                value={email}
                onChange={handleChange}
                className='form-control'
                id='exampleInputEmail1'
                aria-describedby='emailHelp'
              />
            </div>
            <p style={{ color: '#bf2d31', fontWeight: '500' }}>{emailError}</p>
            <div>
              <label htmlFor='exampleInputPassword1' className='form-label'>
                Password
              </label>
              <div className='input-group'>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name='password'
                  value={password}
                  onChange={handleChange}
                  className='form-control d-inline'
                  id='exampleInputPassword1'
                />
                {password && (
                  <span
                    className='input-group-text bg-white'
                    style={{ cursor: 'pointer', borderLeft: 'none' }}
                    onClick={togglePasswordVisibility}
                  >
                    <i
                      className={
                        passwordVisible
                          ? 'fa-regular fa-eye-slash'
                          : 'fa-regular fa-eye'
                      }
                    ></i>
                  </span>
                )}
              </div>
            </div>
            <p style={{ color: '#bf2d31', fontWeight: '500' }}>
              {passwordError}
            </p>
            {/*
          Implement the functionality for Forget Password - Bug 10001
          ---START---
          */}
            <div>
              <label className='form-label'>Select your question</label>
              <select
                className='form-select'
                aria-label='Default select example'
                name='securityQuestion'
                value={securityQuestion}
                onChange={handleChange}
              >
                <option value="What is your mother's maiden name?">
                  What is your mother's maiden name?
                </option>
                <option value='What was the name of your first pet?'>
                  What was the name of your first pet?
                </option>
                <option value='What was the name of your elementary school?'>
                  What was the name of your elementary school?
                </option>
                <option value='What is the name of the town where you were born?'>
                  What is the name of the town where you were born?
                </option>
                <option value='What was your childhood nickname?'>
                  What was your childhood nickname?
                </option>
              </select>
            </div>
            <p style={{ color: '#bf2d31', fontWeight: '500' }}>
              {securityQuestionError}
            </p>
            <div>
              <label
                htmlFor='exampleInputSecurityAnswer'
                className='form-label'
              >
                Your Answer
              </label>
              <div className='input-group'>
                <input
                  type={securityAnswerVisible ? 'text' : 'password'}
                  name='securityAnswer'
                  value={securityAnswer}
                  onChange={handleChange}
                  className='form-control d-inline'
                  id='exampleInputSecurityAnswer'
                />
                {securityAnswer && (
                  <span
                    className='input-group-text bg-white'
                    style={{ cursor: 'pointer', borderLeft: 'none' }}
                    onClick={toggleSecurityAnswerVisibility}
                  >
                    <i
                      className={
                        securityAnswerVisible
                          ? 'fa-regular fa-eye-slash'
                          : 'fa-regular fa-eye'
                      }
                    ></i>
                  </span>
                )}
              </div>
            </div>
            <p style={{ color: '#bf2d31', fontWeight: '500' }}>
              {securityAnswerError}
            </p>
            {/*
          Implement the functionality for Forget Password - Bug 10001
          ---END---
          */}
            <p className='text-center'>
              Already registered? <Link to='/login'>Login here</Link>
            </p>
            <button type='submit' className='btn btn-success w-100'>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
