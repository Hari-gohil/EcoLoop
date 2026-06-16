require('dotenv').config(); // Environment variables (jem ke PORT, DB_URL) ne load karva mate (Load .env variables)
const express = require('express'); // Express framework ne import kariyu web server banavva mate
const cors = require('cors'); // CORS import kariyu jethi front-end backend sathe vat kari shake
const morgan = require('morgan'); // HTTP requests ne console ma jova mate (Logging mate)
const http = require('http'); // Node.js nu inbuilt http module, server banavva mate
const { Server } = require('socket.io'); // Socket.io import kariyu real-time communication (chat) mate
const { notFound, errorHandler } = require('./middlewares/errorMiddleware'); // Error aave to handle karva mate aapna custom middlewares

// Database sathe connection karva mate (Database connection)
const connectDB = require('./config/db');
connectDB(); // Ahiya connection function ne call kariyu

// Badha routes ne ahiya import karya che jethi api no rasto khabar pade (Import routes)
const authRoutes = require('./routes/authRoutes'); // Login/Signup mate
const userRoutes = require('./routes/userRoutes'); // User ni details mate
const adminRoutes = require('./routes/adminRoutes'); // Admin na kaam mate
const wasteRoutes = require('./routes/wasteRoutes'); // Waste (Kachra) ne lagta routes
const requestRoutes = require('./routes/requestRoutes'); // Requests manage karva mate
const reviewRoutes = require('./routes/reviewRoutes'); // Reviews mate
const chatRoutes = require('./routes/chatRoutes'); // Chatting ni API
const notificationRoutes = require('./routes/notificationRoutes'); // Notifications mate
const categoryRoutes = require('./routes/categoryRoutes'); // Categories mate

// Express app chalu karva mate (Initialize app)
const app = express();
const server = http.createServer(app); // App ne HTTP server sathe jodi didhu

// Real-time chat ane notification mate Socket.IO setup (Setup Socket.IO)
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL], // Khali aa URL thi j web socket connect thai shake
    methods: ["GET", "POST"]
  }
});
const setupChatSocket = require('./sockets/chatSocket');
setupChatSocket(io); // Chat socket ne chalu kariyu
const { setupNotificationSocket } = require('./sockets/notificationSocket');
setupNotificationSocket(io); // Notification socket ne chalu kariyu

// API Middlewares (Security ane Data parsing mate)
const allowedOrigins = [
  "https://ecoloop-user.vercel.app",
  "https://main-ecoloop.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Jo koi origin na hoy athva allowed list ma hoy to j aagal vadha devanu
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS")); // Nakar error aapshe
      }
    },
    credentials: true, // Cookies pass karva mate true rakhyu che
  })
);

app.use(express.json()); // Request mathi JSON data vachva mate
app.use(express.urlencoded({ extended: true })); // URL encoded data (form data) vachva mate
app.use(morgan('dev')); // Console ma log jova mate

// Upload kareli files (image/video) ne public karva mate (Static folder)
app.use('/uploads', express.static('uploads'));

// Aa badha main API routes che jene URL sathe jodya che
// Example: '/api/auth' par koi aave to authRoutes chalya jase
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes); // Duplicate admin route, parantu theek che
app.use('/api/categories', categoryRoutes);

// Main default route, jya thi khabar pade ke server chalu che ke nahi (Base route)
app.get('/', (req, res) => {
  res.send('Welcome to Smart Waste Exchange & Management System API');
});

// Jo koi khoto (wrong) route open kare to aa error handling chalya jase
app.use(notFound); // Page not found error mate
app.use(errorHandler); // Biji koi error aave to ahiya jase

// Server ne aapela port par chalu karva mate (Start server)
const PORT = process.env.PORT || 8000; // .env mathi PORT leshe athva 8000 par chalse
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Server start thay etle console ma message aavshe
});
