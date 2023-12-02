import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import SignIn from './SignIn';
import Register from './Register';
import Home from './Home';
import DestinationDetail from './DestinationDetail';
import Itinerary from './Itinerary';

const App = () => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Box textAlign="center" fontSize="xl" bg="D6E8E0" minHeight="100vh">
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/itinerary" element={<Itinerary />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
};

export default App;
