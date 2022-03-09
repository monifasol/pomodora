import './App.css';
import { React, useState } from 'react';
import Clock from './components/Clock';
import logo from './images/logo.png';


function App() {

  const [ currentSlot, setCurrentSlot ] = useState({});
  const [ timeSlots, setTimeSlots ] = useState([]);

  const createSlot = (typeSlot) => {

    let newSlot = { 
      type: typeSlot,
      startTime: new Date(),
      endTime: null
    };

    setCurrentSlot(newSlot);
  };

  const pushSlot = () => {
    //console.log('END SLOT. End time should be updated and slot added to array.');
    currentSlot.endTime = new Date();
    setTimeSlots([currentSlot, ...timeSlots]);
  };

  const showTimeSlots = () => {
    const showHistory = document.querySelector('.show-history');
    showHistory.textContent = (showHistory.textContent === 'Show history') ? 'Hide history' : 'Show history';
    document.querySelector('.history-time-slots').classList.toggle('show');
  };

  const generateTimeString = (time) => {
    if (time) {

      let options = { hour: '2-digit', minute: '2-digit' };
      return time.toLocaleTimeString([], options);
    }
  };

  return (
    <div className="pomodora">

      <div className='header'>
        <img src={logo} alt="logo of pomodora.com" className='logo-pomodora'/>

        <span onClick={showTimeSlots} className='show-history btn lila'>
          Show history
        </span>
      </div>

      <Clock createSlot={createSlot} pushSlot={pushSlot} />

      <div className='history-time-slots'>

        { !timeSlots || timeSlots.length === 0 && `There is no history yet.`}

        { timeSlots && timeSlots.map( (slot, i) => (
          
          <div className='slot' key={i}>
            <p className='time-type'>
              ⏰ <span className='type'>{ slot.type }</span> time: 
            </p>
            <p className='time-display'>
              { generateTimeString(slot.startTime) } to { generateTimeString(slot.endTime) }
            </p>
          </div>
        ))}
      </div> 

    </div>
  ); 
}

export default App;
