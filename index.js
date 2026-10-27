const express = require('express');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const path = require('path');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const app = express();
const PORT =8000;

mongoose.connect('mongodb://localhost:27017/blogify').then((e)=>{
    console.log("Mongodb is Connected");  
})
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieparser());
app.use(checkForAuthenticationCookie("token"));

app.get('/', (req,res)=>{
    res.render("home",{
        user:req.user
    });
})

app.use('/user',userRoute)
app.use('/blog',blogRoute);
app.listen(PORT,()=>{ 
    console.log(`Server Start at Port : ${PORT}`);
})