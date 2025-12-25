const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./db');

// configure env
dotenv.config();

// database config
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


//middleware 
app.use(morgan('dev'));
const NODE_ENV = process.env.NODE_ENV || "development";
//accessing route

app.get("/", (req, res) => {
    res.send("Hello World! 123");
});

app.use('/api', require('./route'));
const startServer = async () => {
    try {
        await connectDB();
        if (NODE_ENV !== "production") {
            app.listen(process.env.PORT, () => {
                console.log("Server started on port:", process.env.PORT);
            });
        }
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); // Exit the process with a failure code
    }
};

startServer();
module.exports = app;