import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styling/App.css'
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import useLogin from './hooks/useLogin'



function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const {checkLogin} = useLogin({setLoggedIn: setLoggedIn});
  useEffect(() => { checkLogin() }, [checkLogin]);

  return (
    <Router>
      {loggedIn ? <Header loggedIn={loggedIn}/> : null}
      <Routes>
        <Route path="/" element={loggedIn ? <Home/> : <Navigate to="/login" />} />
        <Route path="/login" element={ !loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/" />}/>
        
      </Routes>
    </Router>
  )
}

export default App
