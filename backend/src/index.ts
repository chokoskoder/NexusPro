import express from 'express';
import http from 'http';
import { initializeWebsocketServer } from './websocket';

const PORT = 8456;

const app = express();
app.use(express.json());

const httpServer = http.createServer(app)

httpServer.listen(PORT , ()=>{
    console.log("the server is listening on " , PORT)
})
initializeWebsocketServer(httpServer);