import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import Home from './Home';
import DestinationDetail from './DestinationDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

