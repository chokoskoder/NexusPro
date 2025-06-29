import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { LogEntry } from '../types/interfaces';
import { VirtualizedLogList } from './VirtualizedLogList'; // Import our new component

const socket: Socket = io('ws://localhost:8456'); // Connect directly now

export function LogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    function onNewLog(newLog: LogEntry) {
      setLogs(previousLogs => [newLog, ...previousLogs]);
    }
    socket.on('log', onNewLog);
    return () => {
      socket.off('log', onNewLog);
    };
  }, []);

  // The component is now incredibly simple. All the complexity is abstracted away.
  return (
    <div>
      <h1>Nexus Pro - Live Log Stream</h1>
      <p>Log Count: {logs.length}</p>
      <VirtualizedLogList logs={logs} />
    </div>
  );
}