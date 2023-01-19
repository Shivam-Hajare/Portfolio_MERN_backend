const dotenv = require("dotenv")
var cors = require('cors')
app.use(cors({
    origin: 'https://thriving-rolypoly-cb9f6b.netlify.app',
    credentials: true
}));
const express = require("express")
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://thriving-rolypoly-cb9f6b.netlify.app");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
dotenv.config({ path: "./config.env" })

const PORT = process.env.PORT


require("./db/connection")
//const User = require("./db/model/userSchema")
//calling get req post from router file
app.use(require("./router/auth"))


app.listen(PORT, () => {
    console.log("server is running.....");
})