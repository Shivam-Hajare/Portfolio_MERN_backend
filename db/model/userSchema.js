const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[
        {
            name: {
                type: String
            },
            email: {
                type: String
            },
            phone: {
                type: Number
            },
            message: {
                type: String
            }
        }
    ]
    ,
    tokens:[
        {
            token:{
                type: String,
                required: true
    
            }

        }
    ]
})


//Hashing the password

userSchema.pre('save',async function(next){
    if(this.isModified("password"))
    {
        const hash=await bcrypt.hash(this.password,12)
        const chash=await bcrypt.hash(this.cpassword,12)
        this.password=hash;
        this.cpassword=chash;
    }
    next();
})
//jwt token gen and db save
userSchema.methods.generateAuthToken=async function(){
    try{
        let mytoken = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:mytoken})
        await this.save();
        return mytoken;
    }catch(err){
        console.log(err);

    }
}
//storing message

userSchema.methods.addMessage=async function(name,email,phone,message){
    try{
        this.messages=this.messages.concat({name,email,phone,message})
        await this.save();
        return this.messages;
    }
    catch(err){
    console.log(err);
    }
}



const User = mongoose.model('usersDB', userSchema)
module.exports = User;

