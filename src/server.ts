import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';
import { seedDemoUsers } from './utils/seed';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDemoUsers();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION!  Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

startServer();