const mysql = require('mysql')
const dotenv = require('dotenv')
const cors = require('cors');
const express = require('express')
const routes = require('./routes/routes')
const connectDB = require('./db/connectDB')
dotenv.config()

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

async function startServer() {
  connectDB();

  routes(app);

  app.listen(port, () => {
    console.log(`Le serveur est en écoute sur le port ${port}`);
  });
}

startServer();