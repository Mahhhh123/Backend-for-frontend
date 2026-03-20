const { setServers } = require("node:dns/promises");
// หมายเหตุ: ถ้าเชื่อมต่อ MongoDB Atlas ไม่ติด ให้ลองลบ 2 บรรทัดด้านล่างนี้ออกครับ
setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// ลบ xss-sanitizer ออกเพราะมีปัญหาเรื่อง module path
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// 🟢 Enable CORS (สำคัญมาก เพื่อให้ Frontend ที่พอร์ต 3000 เข้าถึงได้)
app.use(cors());

// Set security headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 1000000,
    message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Massage Shop Reservation API',
            version: '1.0.0',
            description: 'API for managing massage shop bookings',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5003}/api/v1`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// 🟢 Mount routers (เช็คชื่อไฟล์ในโฟลเดอร์ routes ให้ตรงนะครับ)
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/reservations', require('./routes/reservation'));
app.use('/api/v1/massageshops', require('./routes/massage'));

const PORT = process.env.PORT || 5003;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});