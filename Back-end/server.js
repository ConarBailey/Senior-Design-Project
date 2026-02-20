require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const getToken = require("./getAccessToken")
const foodSearch = require("./callFatSecretAPI")
var accessToken;
const WebSocket = require('ws');
const PORT = process.env.PORT || 3500;
const socketServer = new WebSocket.Server({port:8080});
socketServer.binaryType = "arraybuffer";


console.log('WebSocket server is running on ws://localhost:8080');

// Connection event handler
socketServer.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // Message event handler
    ws.addEventListener('message', event => {
    console.log('Message to server: ', event.data);
    if(event.data.slice(0,10)=='Food_name='){
        foodSearch.callFatSecretAPI(accessToken,event.data.slice(10,event.data.length)).then((value)=>{
            ws.send("SEARCH_RESULTS:"+JSON.stringify(value));
        });
    }
    });

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/foodlog', require('./routes/foodlog'));

app.use(verifyJWT);

app.use('/', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

(async () => {
     accessToken = await getToken.getAccessToken();
})();