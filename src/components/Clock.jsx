import { React, useState, useEffect } from 'react';
//import tomato from './images/logo.png';

const Clock = () => {

  const maxMinutesFocus = 2;
  const maxMinutesRest = 1;
  const maxSeconds = 10;

  const [ timerRunning, setTimerRunning ] = useState(false);
  const [ currentState, setCurrentState ] = useState('focus');
  const [ minutesLeft, setMinutesLeft ] = useState(maxMinutesFocus);
  const [ secondsLeft, setSecondsLeft ] = useState(0);
  const [ currentSlot, setCurrentSlot ] = useState({});
  const [ timeSlots, setTimeSlots ] = useState([]);

  let intervalTimerId = 0;

  useEffect( () => {
    // runTimer only if it's not in the initial state (in that case we would wait for "Start timer" to be tirggered)
    if (timerRunning) runTimer();
    return () => clearInterval(intervalTimerId);     // cleanup function
  }, [secondsLeft] );


  const runTimer = () => {
    if (!timerRunning) setTimerRunning(true);
    intervalTimerId = setInterval( () => { updateTimer(); }, 1000);    // every 1 sec
  };

  const createSlot = (typeSlot) => {

    let newSlot = { 
      type: typeSlot,
      startTime: new Date(),
      endTime: null
    };

    setCurrentSlot(newSlot);
  };

  const endSlot = () => {
    //console.log('END SLOT. End time should be updated and slot added to array.');
    currentSlot.endTime = new Date();
    setTimeSlots([currentSlot, ...timeSlots]);
    //console.log('currentSlot.endTime', currentSlot.endTime);
    switchTo();
  };

  const updateTimer = () => {

    // if the time for the slot is gone, we end it
    if (minutesLeft === 0 && secondsLeft === 0) endSlot();

    // if time slot just started, then we create new slot
    if (currentState === 'focus' && minutesLeft === (maxMinutesFocus - 1) && secondsLeft === maxSeconds) {
      //console.log('Then, create new slot of focus time!');
      createSlot('focus');
    }

    if (currentState === 'rest' && minutesLeft === (maxMinutesRest - 1) && secondsLeft === maxSeconds) {
      //console.log('Then, create new slot of resting time!');
      createSlot('rest');
    }

    if (secondsLeft === 0 && minutesLeft > 0 ) setMinutesLeft(minutesLeft - 1);
    const newSecondsLeft = secondsLeft === 0 ? maxSeconds : secondsLeft - 1;
    setSecondsLeft(newSecondsLeft);
  };

  const digitToDisplay = (time) => {
    return time.toString().length === 1 ? `0${time}` : time;
  };

  const resetTimer = (currentState) => {
    if (currentState === 'rest') {
      setMinutesLeft(maxMinutesRest);
      setSecondsLeft(0);
    } else {
      setMinutesLeft(maxMinutesFocus);
      setSecondsLeft(0);
    }
  };

  const switchTo = () => {
    const newState = currentState === 'focus' ? 'rest' : 'focus';
    setCurrentState(newState);
    resetTimer(newState);     // otherwise it does not work :(
  };

  const stopResumeTimer = () => {
    if (timerRunning) {
      // stop timer
      clearInterval(intervalTimerId);
      setTimerRunning(false);
      
    } else {
      // resume timer
      updateTimer();
      setTimerRunning(true);
    }
  };

  const generateTimeString = (time) => {
    let options = { hour: '2-digit', minute: '2-digit' };
    return time.toLocaleTimeString([], options);
  };

  return (
    <>

      <div className='main-flex-container'>

        <div className='time-slots-display'>

          { timeSlots && timeSlots.map( (slot, i) => (
            
            <div className='slot' key={i}>
              <p className='time-type'>
                ⏰ <span className='type'>{ slot.type }</span> time: 
              </p>
              <p className='time-display'>
                { generateTimeString(slot.startTime) } to { generateTimeString(slot.endTime) } h
              </p>
            </div>

          ))}

        </div>  {/* end time slots display section (LEFT in flex) */}

        <div className='tomato-section'>
          <h2>{currentState} time!</h2>
          
          <div className='tomato'>
            <div className='timer'>
              <span>{ digitToDisplay(minutesLeft) }</span>
              :
              <span>{ digitToDisplay(secondsLeft) }</span>
            </div>
          </div>

          <p className='time-paused'>{ !timerRunning && <span>{currentState} time paused!</span>}</p>

          <div className='section-buttons'>

            <div className='btn' onClick={runTimer}>
              Start!
            </div>

            <div className='btn' onClick={switchTo}>
              Swith to { currentState === 'focus' ? 'rest' : 'focus' }
            </div>

            <div className='btn' onClick={resetTimer}>
              Reset { currentState } time
            </div>

            <div className='btn' onClick={stopResumeTimer}>
              { !timerRunning ? 'Resume' : 'Pause' }
              { ` ${currentState}` } time
            </div>
          </div>
        </div> {/* end tomato section (RIGHT in flex) */}
      </div>
    </>
  );
};

export default Clock;
