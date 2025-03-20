import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthenticationState from './context/authentication/AuthenticationState';
import AlertState from './context/alert/AlertState';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import NotFound from './components/NotFound';

/*
Very Important:-
1. In the latest react-router-dom v6.24.1 you have to use <Routes></Routes> instead of <Switch>
2. If you want to show navbar at the top, create <route path="/" element={<Navbar />} ... </Route>
    Between ... you can route your other components, like Home, About etc.
3. When use <Link> tag instead of <a> tag, you have to use <Outlet /> method at the very end of the file and also import it, It comes from react-router-dom package.
    Use-case - Mainly in Navbar, Footer like areas where we have mention other end-points.
*/

function App() {
  const [searchTag, setSearchTag] = useState('');
  return (
    <>
      <AlertState>
        <NoteState>
          <AuthenticationState>
            <BrowserRouter>
              <Routes>
                <Route
                  path='/'
                  element={<Navbar setSearchTag={setSearchTag} />}
                >
                  <Route index element={<Home searchTag={searchTag} />} />
                  <Route path='about' element={<About />} />
                  <Route path='login' element={<Login />} />
                  <Route path='signup' element={<Signup />} />
                  <Route
                    path='login/forgotpassword'
                    element={<ForgotPassword />}
                  />
                  <Route path='profile' element={<Profile />} />
                </Route>
                {/* Catch-all route at the bottom */}
                <Route path='*' element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthenticationState>
        </NoteState>
      </AlertState>
    </>
  );
}

export default App;
