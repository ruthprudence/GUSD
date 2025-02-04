// src/Components/DBStatus.js
import { useEffect, useState } from 'react';
import { fetchDBStatus } from './API/statusService';

function DBStatus() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function getStatus() {
      const result = await fetchDBStatus();
      setStatus(result);
    }
    getStatus();
  }, []);

  return (
    <div>
      <h2>Database Status: {status}</h2>
    </div>
  );
}

export default DBStatus;
