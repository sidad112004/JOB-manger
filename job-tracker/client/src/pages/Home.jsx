import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';

export function Home() {
  const [healthStatus, setHealthStatus] = useState('Checking server status...');

  useEffect(() => {
    // Task 7 - Connect Frontend to Backend
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        setHealthStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error fetching health status:', error);
        setHealthStatus('Failed to connect to server');
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Job Application Tracker</h1>

      <Button className="mb-8 p-6 text-lg hover:bg-gray-800 transition-all duration-300">
        Create Company
      </Button>

      <div className="mt-12 p-4 bg-white rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Backend Status:</h2>
        <p className="text-green-600 font-medium">{healthStatus}</p>
      </div>
    </div>
  );
}
