import React, { useState } from 'react';
import './styles/StartInterviewForm.css';

export default function StartInterviewForm({ onSubmit }) {
  const [topic, setTopic] = useState('');
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ topic, role, difficulty });
    }
  };

  return (
    <div className="start-form-container">
      <div className="instructions">
        <h2>Interview Instructions</h2>
        <ul>
          <li>Questions will appear one by one.</li>
          <li>Once a question is skipped, you cannot reattempt it.</li>
          <li>Your video response will be recorded.</li>
          <li>Try to maintain eye contact and answer confidently.</li>
          <li>You will get feedback based on your answers and expressions.</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="start-form">
        <label >
          Select Topic:
          <div className='input-group'>
          <input type='text' value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder=''/>
          </div>
        </label>

        <label>
          Select Role:
          <div className='input-group'>
          <input type='text' value={role} onChange={(e)=>setRole(e.target.value)} placeholder=''/>
          </div>
        </label>

        <label>
          Difficulty Level:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            <option value="">-- Choose Difficulty --</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <div className="form-group">
        <label>Ask Your Own Question (Optional):</label>
        <textarea
          placeholder="Type your custom question here..."
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
        />
      </div>

        <button type="submit" className="start-btn">Attempt Interview</button>
      </form>
    </div>
  );
}
