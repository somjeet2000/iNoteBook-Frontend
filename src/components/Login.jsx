import React, { useContext, useState } from 'react';
import authContext from '../context/authentication/AuthenticationContext';
import { Link, useNavigate } from 'react-router-dom';
import alertContext from '../context/alert/AlertContext';
import Alert from './Alert';
import { useEffect } from 'react';

const Login = () => {
  const context = useContext(authContext);
  const { loginUser, getUserData } = context;
  const context2 = useContext(alertContext);
  const { alert, showAlert } = context2;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    if (password.length !== 0) {
      setPasswordVisible(!passwordVisible);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression for password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
    let isValid = true;
    if (email.length === 0) {
      setEmailError('Email cannot be empty');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
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
    if (isValid) {
      showAlert('Please wait! Verifying your credentials...', 'info');
      const loginSuccess = await loginUser(email, password, navigate);
      if (loginSuccess) {
        showAlert('User LoggedIn successfully', 'success');
        await getUserData();
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
    // <>
    //   <Alert alert={alert} />
    //   <div className='container my-3'>
    //     <h2 className='text-center'>Login to continue in ThinkPad</h2>
    //     <form onSubmit={handleSubmit}>
    //       <div>
    //         <label htmlFor='exampleInputEmail1' className='form-label'>
    //           Email address
    //         </label>
    //         <input
    //           type='email'
    //           name='email'
    //           value={email}
    //           onChange={handleChange}
    //           className='form-control'
    //           id='exampleInputEmail1'
    //           aria-describedby='emailHelp'
    //         />
    //       </div>
    //       <p style={{ color: '#bf2d31', fontWeight: '500' }}>{emailError}</p>
    //       <div>
    //         <label htmlFor='exampleInputPassword1' className='form-label'>
    //           Password
    //         </label>
    //         <input
    //           type={passwordVisible ? 'text' : 'password'}
    //           name='password'
    //           value={password}
    //           onChange={handleChange}
    //           className='form-control d-inline'
    //           id='exampleInputPassword1'
    //         />
    //         {password && (
    //           <i
    //             className={
    //               passwordVisible
    //                 ? 'fa-regular fa-eye-slash'
    //                 : 'fa-regular fa-eye'
    //             }
    //             style={{ marginLeft: '-30px', cursor: 'pointer' }}
    //             onClick={togglePasswordVisibility}
    //           ></i>
    //         )}
    //       </div>
    //       <p style={{ color: '#bf2d31', fontWeight: '500' }}>{passwordError}</p>
    //       <p>
    //         Forgot Password? <Link to='/forgotpassword'>Click here</Link>
    //       </p>
    //       <p>
    //         New User? <Link to='/signup'>Register here</Link>
    //       </p>
    //       <button type='submit' className='btn btn-primary'>
    //         Login
    //       </button>
    //     </form>
    //   </div>
    // </>
    <>
      <Alert alert={alert} />
      <div className='container mt-5'>
        <div
          className='card p-4 shadow-sm'
          style={{
            maxWidth: '400px',
            margin: 'auto',
          }}
        >
          <h3 className='text-center mb-4'>Welcome Back ✌️</h3>
          <form onSubmit={handleSubmit}>
            <div className='mb-2'>
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
            <div className='mb-2'>
              <label htmlFor='exampleInputPassword1' className='form-label'>
                Password
              </label>
              <div className='input-group'>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name='password'
                  value={password}
                  onChange={handleChange}
                  className='form-control'
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
            <div className='text-center'>
              <p>
                Forgot Password?{' '}
                <Link to='/login/forgotpassword'>Click here</Link>
              </p>
              <p>
                New User? <Link to='/signup'>Register here</Link>
              </p>
            </div>
            <button type='submit' className='btn btn-success w-100'>
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
