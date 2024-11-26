// File: /components/MemoryUsage.tsx
import { useEffect, useState } from 'react';

const MemoryUsage = () => {
  const [memoryStats, setMemoryStats] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const fetchMemoryUsage = async () => {
      const response = await fetch('/api/memory-usage');
      const data = await response.json();
      setMemoryStats(data);
    };

    fetchMemoryUsage();
    const interval = setInterval(fetchMemoryUsage, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{position: 'fixed', bottom: "50px", right: '50px'}}>
      <h2>Memory Usage</h2>
      {memoryStats ? (
        <ul>
          {Object.entries(memoryStats).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MemoryUsage;