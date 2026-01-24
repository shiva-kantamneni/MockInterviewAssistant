import React, { useState, useEffect, useRef } from 'react';
import StartInterviewForm from './StartInterviewForm';
import Webcam from 'react-webcam';
import './styles/Interview.css';

export default function InterviewApp() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('form');
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);

  const handleFormSubmit = async ({ topic, role, difficulty, customQuestion }) => {
    try {
      const response = await fetch('http://localhost:5000/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, role, difficulty, customQuestion }),
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setPhase('interview');
        setTimeLeft(60);
      } else {
        alert('No questions found.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Something went wrong while fetching questions.');
    }
  };

  const goToNextQuestion = () => {
    clearInterval(timerRef.current);
    stopRecording(); 
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      setPhase('done');
    }
  };

  useEffect(() => {
    if (phase === 'interview') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            goToNextQuestion(); // auto-skip
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, phase]);

  // Video Recording Logic
  const startRecording = () => {
    const stream = webcamRef.current.stream;
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      setRecordedBlobs(prev => [...prev, { question: questions[currentIndex], video: videoBlob }]);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  if (phase === 'form') {
    return <StartInterviewForm onSubmit={handleFormSubmit} />;
  }

  if (phase === 'interview') {
    return (
      <div className="question-screen">
        <h2>Question {currentIndex + 1} of {questions.length}</h2>
        <p>{questions[currentIndex]}</p>

        <div className="timer">⏳ Time Left: {timeLeft} seconds</div>

        <Webcam audio={true} ref={webcamRef} mirrored={true} className="webcam" />

        <div className="action-buttons">
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}
          <button onClick={goToNextQuestion}>Skip</button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="done-screen">
        <h2>Interview Completed!</h2>
        <p>All questions have been answered or skipped.</p>
        <ul>
          {recordedBlobs.map((item, idx) => (
            <li key={idx}>
              <strong>Q:</strong> {item.question}
              <br />
              <video src={URL.createObjectURL(item.video)} controls width="300" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}
