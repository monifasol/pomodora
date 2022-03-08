import { React, useState, useEffect } from 'react';

const Clock = () => {

  const maxMinutesFocus = 25;
  const maxMinutesRest = 5;
  const maxSeconds = 59;

  const [ currentState, setCurrentState ] = useState(0);
  const [ minutesLeft, setMinutesLeft ] = useState(maxMinutesFocus);
  const [ secondsLeft, setSecondsLeft ] = useState(0);
  const [ currentSlot, setCurrentSlot ] = useState({});
  const [ timeSlots, setTimeSlots ] = useState([]);

  let intervalTimerId = 0;

  // legend states
  const timerStates = {
    0: 'When you are ready, press start!',
    1: 'Time to focus!',
    2: 'Focus time paused',
    3: 'Time to rest!',
    4: 'Resting time paused',
    5: 'Break of 15-30 minutes!'
  }

  useEffect( () => {
    // runTimer only if it's not in the initial state (in that case we would wait for "Start timer" to trigger "runTimer()")
    if (currentState === 1 || currentState === 3) runTimer();
    return () => clearInterval(intervalTimerId);     // cleanup function
  }, [secondsLeft] );

  const runTimer = () => {
    
    if (currentState === 0) setCurrentState(1);
    if (currentState === 2) setCurrentState(1);
    if (currentState === 4) setCurrentState(3);

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
    switchTo();
  };

  const updateTimer = () => {

    // if the time for the slot is gone, we end it
    if (minutesLeft === 0 && secondsLeft === 0) endSlot();

    // If it's initial state OR if focus time slot just started
    // Then, create new slot of focus time!
    if ( currentState === 0 || 
        (currentState === 1 && minutesLeft === (maxMinutesFocus - 1) && secondsLeft === maxSeconds)
       ) {
      setCurrentState(1);     // 1 = focus time
      createSlot('focus');
    }

    // If it's initial state OR if resting time slot just started
    // Then, create new slot of resting time!
    if (currentState === 3 && minutesLeft === (maxMinutesRest - 1) && secondsLeft === maxSeconds) {
      setCurrentState(3);     // 3 = rest time
      createSlot('rest');
    }

    // Set seconds left
    if (secondsLeft === 0 && minutesLeft > 0 ) setMinutesLeft(minutesLeft - 1);
    const newSecondsLeft = secondsLeft === 0 ? maxSeconds : secondsLeft - 1;
    setSecondsLeft(newSecondsLeft);
  };

  const digitToDisplay = (time) => {
    return time.toString().length === 1 ? `0${time}` : time;
  };

  function resetTimer(newState) {
    
    let typeTime = null;

    // We first evaluate if newState exists (which means we come from switchTo)
    if (newState && newState === 3) typeTime = 'rest'
    else if (newState && newState === 1) typeTime = 'focus'
    else if (isRestingTime()) typeTime = 'rest'
    else if (isFocusTime()) typeTime = 'focus'

    if (typeTime === 'rest') {
      setMinutesLeft(maxMinutesRest);
      setSecondsLeft(0);
    } else if (typeTime === 'focus') {
      setMinutesLeft(maxMinutesFocus);
      setSecondsLeft(0);
    }
  };

  const switchTo = () => {
    const newState = isFocusTime() ? 3 : 1;
    setCurrentState(newState);
    resetTimer(newState);         
  };

  const stopResumeTimer = () => {
    if (isTimeRunning()) {
      // Time is running, so we stop timer
      clearInterval(intervalTimerId);
      // Set new state
      const newState = currentState === 1 ? 2 : 4;
      setCurrentState(newState);

    } else if (isTimePaused()) {
      // Time was paused, so we resume timer
      updateTimer();
      // Set new state
      const newState = currentState === 2 ? 1 : 3;
      setCurrentState(newState);
    }
  };

  const generateTimeString = (time) => {
    let options = { hour: '2-digit', minute: '2-digit' };
    return time.toLocaleTimeString([], options);
  };

  const isFocusTime = () => currentState === 1 || currentState === 2;

  const isRestingTime = () => currentState === 3 || currentState === 4 || currentState === 5;

  const isTimeRunning = () => currentState === 1 || currentState === 3;

  const isTimePaused = () => currentState === 2 || currentState === 4;

  const showTimeSlots = () => {
    const showHistory = document.querySelector('.show-history');
    showHistory.textContent = (showHistory.textContent === 'Show history') ? 'Hide history' : 'Show history';
    document.querySelector('.history-time-slots').classList.toggle('show');
  }

  return (
    <>

      <span onClick={showTimeSlots} className='show-history btn lila'>
        Show history
      </span>

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

      <div className='tomato-section'>

        <div className='arm-banner'>
            <span className='arm-banner-text'>{ timerStates[currentState] }</span>
        </div>

        <div className='tomato'>
          <div className='timer'>
            <span>{ digitToDisplay(minutesLeft) }</span>
            :
            <span>{ digitToDisplay(secondsLeft) }</span>
          </div>
        </div>

        <div className='section-buttons'>

          { currentState === 0 ? 
            <div className='btn green' onClick={runTimer}>
              <span>Start!</span>
            </div>
            :
            <div className='btn orange' onClick={stopResumeTimer}>
              <span> 
                { isTimeRunning() && 'Pause timer' }
                { isTimePaused() && 'Resume timer' }
              </span>
            </div>
          }

          { currentState !== 0 && 
            <>
              <div className='btn green' onClick={resetTimer}>
                <span> 
                  Reset
                  { isFocusTime() && ' focus time' }
                  { isRestingTime() && ' resting time' }
                </span>
              </div>

              <div className='btn green' onClick={switchTo}>
                <span>
                  Switch to 
                  { isFocusTime() && ' resting time' }
                  { isRestingTime() && ' focus time' }
                </span>
              </div>
            </>
          }

        </div>
      </div> 
    </>
  );
};

export default Clock;
