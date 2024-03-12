const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// 建立連線到 MongoDB
const connectionString = `mongodb+srv://${process.env.mongodbName}:${process.env.mongodbPassword}@cluster0mongo.pbvnh4m.mongodb.net/?retryWrites=true&w=majority`

mongoose
.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.error("connected to MongoDB");
})
.catch((error) => {
  console.error(error);
});

// 建立一個 Express 應用程式
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const flash = require('connect-flash');
const bodyParser = require('body-parser');
// const expressSession = require('cookie-session');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sessionConfig = {
  secret: 'mySecretKey',
  name: "__session",
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    maxAge:600000,
    secure: false,
    httpOnly: false,
  },
};
app.set('trust proxy', 1);

app.use(expressSession(sessionConfig));

const passport = require("./middleware/passport");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// const os = require('os');

// const getLocalIpAddress = () => {
//   const interfaces = os.networkInterfaces();
//   for (const interfaceName in interfaces) {
//     const addresses = interfaces[interfaceName];
//     for (const address of addresses) {
//       if (address.family === 'IPv4' && !address.internal) {
//         return address.address;
//       }
//     }
//   }
//   return 'localhost';
// };

// const localIpAddress = getLocalIpAddress();
// console.log(localIpAddress)

// 跨域存取
const corsOptions = {
  "origin": [
    process.env.ORIGIN_URL,
  ],
  "methods": "GET,PATCH,POST,DELETE",
  "credentials": true
};
app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json());

const memberRouter = require("./routers/memberRouter");
const projectFileRouter = require("./routers/projectFileRouter");
const authenticationRouter = require("./routers/authenticationRouter");
const rsaRouter = require("./routers/rsaRouter");
const profileRouter = require("./routers/profileRouter");

app.use("/members", memberRouter);

app.use("/projectfile", projectFileRouter);

app.use("/authentication", authenticationRouter);

app.use("/", rsaRouter);

app.use("/profile", profileRouter);

var port = process.env.PORT || 5000;

// 啟動應用程式
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});