import { useState, useEffect, useRef } from 'react'
import './App.css'



function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [session, setSession] = useState(25);
  const [time, setTime] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true); 
  const audioRef = useRef(null);
  
  

  function incrementBreak() {
    breakLength < 60 ? setBreakLength(breakLength + 1) : setBreakLength(breakLength);
  }


  const decrementBreak = () => {
    if (breakLength > 1){
      setBreakLength(breakLength-1);
    }
  };

  const incrementSession = () => {
    if (session < 60) {
      setSession(session + 1);
      if (!isRunning) {
        setTime((session+1) * 60);
      }
    } else {
      setSession(session);
    }
   
  };

  const decrementSession = () => {
    setSession(prevSession => {
        const newSession = prevSession > 1 ? prevSession - 1 : prevSession;
        if (!isRunning) {
            setTime(newSession * 60);  // Synchronize the time with the new session length
        }
        return newSession;
    });
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);

    } else if (time === 0) {

      setTimeout(() => {
        if (isSession) {
          setIsSession(false);
          setTime(breakLength * 60);
        } else {
          setIsSession(true);
          setTime(session * 60);
        }
      }, 1000);

       
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch((error) => console.log(error));

    }
  }, [isRunning, time, isSession, session, breakLength]);

  const formatTime = () => {
    const min = Math.floor(time/60);
    const sec = time % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;    
  };

  const startStopButton = () => {
    setIsRunning(!isRunning);
  };

  const resetButton = () =>{
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSession(25);
    setTime(1500);

    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <>
      <div id='clock-container'>
        <h2 id='clock-title'>This is a Pomodoro Clock.</h2>

        <div className='controls-wrap'>
          <div className='controls' id='session-controls'>
            <div id='session-label'>Session Length</div>
            <button className='adjust-button' id='session-increment' onClick={incrementSession}>
              <i className="fa-solid fa-arrow-up"></i>
            </button>
            <div id='session-length'>{session}</div>
            <button className='adjust-button' id='session-decrement' onClick={decrementSession}>
              <i className="fa-solid fa-arrow-down"></i>
            </button>
          </div>
          <div className='controls' id='break-controls'>
            <div id='break-label'>Break Length</div>
            <button className='adjust-button' id='break-increment' onClick={incrementBreak}>
              <i className="fa-solid fa-arrow-up"></i>
            </button>
            <div id='break-length'>{breakLength}</div>
            <button className='adjust-button' id='break-decrement' onClick={decrementBreak}>
              <i className="fa-solid fa-arrow-down"></i>
            </button>
          </div>
        </div>

        <div className='timer'>
          <div id='timer-label'>{isSession ? "Session:" : "Break:" }</div>
          <div id='time-left'>{formatTime()}</div>
        </div>

        <div className='actions'>
          <button className='action-button' id='start_stop' onClick={startStopButton}>
            <i className={isRunning ? "fa-solid fa-pause" : "fa-solid fa-play"}></i>
          </button>
          <button className='action-button' id='reset' onClick={resetButton}>reset</button>
        </div>

         <audio id='beep' ref={audioRef} src="https://www.soundjay.com/buttons/sounds/button-2.mp3"></audio>

        <p>created by Ivan Leong.</p>        
        
      </div>
     
    </>
  )
}

export default App
