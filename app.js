const dotenv = require("dotenv")

const express = require("express")
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());


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