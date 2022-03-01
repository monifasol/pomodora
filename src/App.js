import { React } from 'react';
import './App.css';
import Clock from './components/Clock';
import logo from './images/logo.png';

function App() {
  return (
    <div className="pomodora">
      <img src={logo} alt="logo of pomodora.com" className='logo-pomodora'/>
      <Clock/>
    </div>
  ); 
}

export default App;
