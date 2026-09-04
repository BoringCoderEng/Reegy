require('dotenv').config();
const http = require("http");
const app=require('./src/app.js');
const { initSocket } = require("./src/socket");
const connectDB=require('./src/db/db');

connectDB(); 

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const { startAutoCancelJob } = require("./src/jobs/autoCancelStaleOrders");
startAutoCancelJob();