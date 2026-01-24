import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Dashboard from './Dashboard';
import StartInterviewForm from './StartInterviewForm';
import InterviewApp from './Interview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/startInterview' element={<StartInterviewForm />} />
        <Route path='/interview' element={<InterviewApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
