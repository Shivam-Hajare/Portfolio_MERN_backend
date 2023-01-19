const express = require("express")
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const authenticate = require("../db/middleware/authenticate")
//database connection and userSchema file imported
require("../db/connection")
const User = require("../db/model/userSchema")
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())

router.get("/", (req, res) => {
    res.send("hello from router /")
})

router.post("/register", async (req, res) => {
    // res.send(req.body);
    // res.json({message:req.body})
    const { name, email, phone, work, password, cpassword } = req.body;
    //if any filds are not inputed
    if (!name || !email || !phone || !work || !password || !cpassword) {
        console.log("Plaese fill all filds");
        return res.status(422).json({ error: "Plaese fill all filds" })
    }
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist)
            return res.status(422).json({ error: "User already exist" })
        else if (password != cpassword)
            return res.status(422).json({ error: "password are not matching" })
        else {
            const user = new User({ name, email, phone, work, password, cpassword })

            await user.save();
            res.status(201).json({ message: "successful stored db" })

        }


    } catch (err) {
        console.log(err);
    }

    //for user already exist
    //     User.findOne({ email: email })
    //         .then((userExist) => {

    //             if (userExist)
    //                 return res.status(422).json({ error: "User already exist" })
    //             else {
    //                 //new user data storing
    //                 const user = new User({
    //                     name, email, phone, work, password, cpassword
    //                 })

    //                 User.insertMany(user, (err) => {
    //                     if (err) {
    //                         console.log("err to store DB");
    //                         res.status(500).json({ error: "failed to store" })
    //                     }

    //                     else {
    //                         console.log("successful stored db");
    //                         res.status(201).json({ message: "successful stored db" })

    //                     }
    //                 })

    //             }
    //         })
})

router.post("/signin", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Plaese fill all filds");
            return res.status(400).json({ error: "Plaese fill all filds" })
        }
        const userLogin = await User.findOne({ email: email });
        if (!userLogin) {
            return res.status(400).json({ error: "user error" })
        }
        else {
            //JWT token generation
            token= await userLogin.generateAuthToken();
            //to token in cookie
            console.log(token);
            res.cookie("jwtoken",token,{
                expires: new Date(Date.now()+25920000000)
            });

            //password checking with db
            const DBPassword = userLogin.password;
            const match = await bcrypt.compare(password, DBPassword);

            if (match) {
                return res.status(200).json({ message: "loged in" })
            }
            else
                return res.status(400).json({ error: "username and pass is incorrect" })

        }
    }
    catch (err) {
       console.log(err);
    }
})


router.get("/about",authenticate,(req,res)=>{
    res.send(req.rootUser)
})

router.get("/getdata",authenticate,(req,res)=>{
    
    res.send(req.rootUser)
})

router.post("/contact",authenticate,async(req,res)=>{
    try{
        const {name,email,phone,message}=req.body;

        if(!name || !email || !phone || !message)
        {
            return res.json({message:"please fill the form"})
        }
        const userContact =await User.findOne({_id:req.userID})
        if(userContact)
        {
            const userMeesage= await userContact.addMessage(name,email,phone,message)
            await userContact.save();
            res.status(201).json({message: "msg saved"})
        }
    } catch (err) {
       console.log(err);
    }
})
router.get("/logout",(req,res)=>{
    res.clearCookie("jwtoken",{path:"/"})
    res.status(200).send("user logout")
})
module.exports = router