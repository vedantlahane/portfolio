// TestApi.jsx
import React, { useEffect, useState } from 'react';

const TestApi = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">API Test</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestApi;