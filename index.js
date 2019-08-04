const express = require('express');
const port  = 5000;
const app = express();

/*
    Route: /posts
    Description: displaying all posts
    Access: public
*/
app.get("/posts",(req,res)=>{
    // fetch all posts from db into postsData variable
    res.json({posts:postsData});
})


/*
    Route: /post/:title/:id
    Description: displaying a single post
    Access: public
*/
app.get("/post/:title/:id",(req,res)=>{
    // fetch a single post based on id from db into postData variable
    res.json({post:postData});
})

/*
    Route: /comments/:p_id
    Description: displaying a single post comments
    Access: public
*/
app.get("/comments/:p_id",(req,res)=>{
    // fetch a single post based on id from db into commentData variable
    res.json({comments:commentData});
})

/*
    Route: /login
    Description: login a user and return jwt
    Access: public
*/
app.get("/login",(req,res)=>{
    // check for user data in db and return jwt if user exists

    res.json({jwt:jwt});
})


/*
    Route: /register
    Description: register a user and return user
    Access: public
*/
app.get("/register",(req,res)=>{
    // store user data in db and return this user

    res.json({usr:usr});
})


app.listen(port,(req,res)=>{
    console.log(`server is running at ${port}`)
})