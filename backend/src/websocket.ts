import { Server , Socket } from "socket.io";
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

interface LogEntry{
    id : string ; 
    correlationId : string;
    timestamp : number ; 
    level : 'info' | 'warn' | 'error';
    message : string ; 
    service : 'api' | 'db' | 'auth' | 'payments' | 'frontend';
}

const levels: LogEntry['level'][] = ['info', 'info', 'info', 'info', 'warn', 'error']; // Skew towards 'info'
const services: LogEntry['service'][] = ['api', 'db', 'auth', 'payments', 'frontend'];
const messages: string[] = [
    'User logged in successfully',
    'Database query executed in 25ms',
    'Payment processed for order #',
    'API endpoint GET /users called',
    'Failed login attempt for user: admin',
    'Frontend component rendered',
    'Authentication token validated',
    'Database connection timeout',
    'New user registered',
    'Cache cleared for service'
];

export function initializeWebsocketServer(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: '*', // In production, restrict this to your frontend's URL
            methods: ['GET', 'POST']
        }
    });

    // 3. The 'connection' event handler
    // This block runs every time a new client connects to our server.
    io.on('connection', (socket: Socket) => {
        console.log(`[CONNECT] New client connected: ${socket.id}`);

        // This is the core logic for the firehose.
        // We use setInterval to repeatedly call a function.
        const intervalId = setInterval(() => {
            // This function creates and emits a new log entry.
            const logEntry = generateLogEntry();
            
            // We emit the event 'log' with the data to THIS specific client.
            socket.emit('log', logEntry);
            console.log(logEntry);

        }, 50); // The magic number: 50 milliseconds

        // 4. The 'disconnect' event handler
        // This is crucial for cleanup. It runs when this specific client disconnects.
        socket.on('disconnect', () => {
            console.log(`[DISCONNECT] Client disconnected: ${socket.id}`);
            // We MUST clear the interval, otherwise the server will keep
            // trying to generate logs for a dead socket, causing a memory leak.
            clearInterval(intervalId);
        });
    });
}


// --- Helper Function to Generate Logs ---

let correlationCounter = 0;
let currentCorrelationId = uuidv4();

function generateLogEntry(): LogEntry {
    // This logic implements the 'Event Correlation' feature.
    // Every 5-15 logs, we generate a new correlationId.
    if (correlationCounter > (5 + Math.random() * 10)) {
        currentCorrelationId = uuidv4();
        correlationCounter = 0;
    }

    correlationCounter++;

    return {
        id: uuidv4(),
        correlationId: currentCorrelationId,
        timestamp: Date.now(),
        level: levels[Math.floor(Math.random() * levels.length)],
        message: `${messages[Math.floor(Math.random() * messages.length)]} ${Math.round(Math.random() * 1000)}`,
        service: services[Math.floor(Math.random() * services.length)]
    };
}
