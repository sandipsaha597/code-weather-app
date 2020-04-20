import React, { useState, useEffect } from 'react';
// import ShowWhether from './components/ShowWhether'
import './App.css';
import ShowWeather from './components/ShowWeather';

function App() {
  return (
    <div className="App">
      <div className='container'>
        <h1>Weather App</h1>
        <ShowWeather/>
      </div>
    </div>
  );
}

export default App; 
