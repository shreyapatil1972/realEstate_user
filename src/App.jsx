// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
 
 
import './App.css';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/property/:id' element={<PropertyDetail/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;