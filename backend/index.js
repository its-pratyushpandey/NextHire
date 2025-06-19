import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import http from 'http';
import { Server } from 'socket.io';

// Import routes
import aiJobMatchingRoutes from "./routes/aiJobMatching.routes.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import uploadRoute from "./routes/upload.js";
import recruiterRoute from "./routes/recruiter.route.js";
import aiRoutes from './routes/ai.js';
import chatRoutes from './routes/chat.route.js';
import recruiterRoutes from './routes/recruiter.route.js';
import resumeParserRoutes from "./routes/resumeParser.routes.js";
import aiCoverLetterRoutes from "./routes/aiCoverLetter.routes.js";
import aiChatRoutes from './routes/aiChat.js';
import aiResumeRoutes from "./routes/aiResume.routes.js";
import ChatMessage from './models/chat.model.js';
import connectDB from './utils/db.js';
import verifyToken from './middlewares/verifyToken.js';

// Ensure required environment variables are set
const requiredEnvVars = [
  ["PORT", "8000"],
  ["MONGO_URI", undefined],
  ["JWT_SECRET", undefined],
  ["NODE_ENV", "development"],
  ["CLOUDINARY_CLOUD_NAME", undefined],
  ["CLOUDINARY_API_KEY", undefined],
  ["CLOUDINARY_API_SECRET", undefined],
];
for (const [envVar, defaultValue] of requiredEnvVars) {
  if (!process.env[envVar]) {
    if (defaultValue !== undefined) {
      process.env[envVar] = defaultValue;
      console.log(`Using default value for ${envVar}: ${defaultValue}`);
    } else {
      console.error(`Error: ${envVar} environment variable is required`);
      process.exit(1);
    }
  }
}

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["set-cookie"],
  maxAge: 600,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1", uploadRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/resume", resumeParserRoutes);
app.use("/api/ai", aiJobMatchingRoutes);
app.use("/api/ai", aiCoverLetterRoutes);
app.use('/api/ai', aiChatRoutes);
app.use("/api/ai", aiResumeRoutes);

// Protected test route
app.get("/api/v1/test/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Something went wrong!",
    success: false,
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
  });
  socket.on('sendMessage', ({ roomId, message }) => {
    // Only broadcast the message to other clients in the room
    socket.to(roomId).emit('receiveMessage', message);
  });
});

// Connect to MongoDB
connectDB();

// Start server with retry logic
const startServer = async (retries = 5) => {
  try {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Client URL: ${process.env.CLIENT_URL}`);
      console.log('Server is ready to accept connections');
    });
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts remaining`);
      setTimeout(() => startServer(retries - 1), 5000);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

console.log('Starting server...');
startServer();
