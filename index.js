const express = require('express');
const mongoose = require('mongoose');
const mongoURI = require('./config/keys').mongoURI;
const key = require('./config/keys').keyorSecret;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 5000;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// connect to db
// mongoose.connect("mongodb://localhost/blogsystem",{ useNewUrlParser: true })
mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(msg => console.log("db connected"))
    .catch(err => console.log(err));

const Schema = mongoose.Schema;
// Schema Definition
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Users = mongoose.model('users', UserSchema)

// post Schema
const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Posts = mongoose.model('posts', PostSchema)












/*
    Route: /posts
    Description: displaying all posts
    Access: public
*/
app.get("/posts", (req, res) => {
    // fetch all posts from db into postsData variable
    Posts.find()
        .then(data=>res.json({posts:data}))
        .catch(err=> res.json("no post available"))
    // res.json({ posts: postsData });
})


/*
    Route: /post/:title/:id
    Description: displaying a single post
    Access: public
*/
app.get("/post/:id", (req, res) => {
    // fetch a single post based on id from db into postData variable
    Posts.findById({_id:req.params.id})
        .then(data=>res.json({post:data}))
        .catch(err=> res.json("no such post available"))
    // res.json({ post: postData });
})

/*
    Route: /comments/:p_id
    Description: displaying a single post comments
    Access: public
*/
app.get("/comments/:p_id", (req, res) => {
    // fetch a single post based on id from db into commentData variable

    res.json({ comments: commentData });
})

/*
    Route: /login
    Description: login a user and return jwt
    Access: public
*/
app.get("/login", (req, res) => {
    // check for user data in db and return jwt if user exists
    const { email, password } = req.body;
    Users.findOne({ email })
        .then(usr => {
            if (usr) {
                if (usr.password === password) {
                    // make a jwt 
                    const payload = {
                        name: usr.name,
                        email: usr.email
                    }
                    let token = jwt.sign({
                        data: payload
                    }, key, { expiresIn: 60 * 60 });

                    // console.log(token);
                    // res.json({ msg: "usr exist", userInfo: usr })
                    res.json({ msg: "usr exist", token })
                } else {
                    res.status(400).json({ msg: "incorrect password" })
                }
            } else {
                res.status(400).json({ msg: "user not found" })
            }
        })
        .catch(err => console.log(err))

    // res.json({ jwt: jwt });
})


/*
    Route: /register
    Description: register a user and return user
    Access: public
*/
app.post("/register", (req, res) => {
    // store user data in db and return this user
    console.log(req.body);
    let { name, email, password } = req.body;
    const newUser = new Users({
        name,
        email,
        password
    });

    newUser.save()
        .then(usr => res.json({ registeredUser: usr }))
        .catch(err => console.log(err))

    // res.json({usr:"new user info"});
})


/*
    Route: /addpost
    Description: add a post
    Access: private
*/
app.post('/addpost', (req, res) => {
    const { token } = req.headers;
    const { title, description } = req.body;
    if (validateToken(token) === 'valid') {
        // return res.json({ msg: "user is authorized for this request" })
        const newPost = new Posts({
            title,
            description
        });

        newPost.save()
            .then(post => res.json({ msg: "new post created" }))
            .catch(err => console.log(err))
    } else {
        res.status(400).json({ msg: "unauthorized access" })
    }
})

function validateToken(token) {
    if (token) {
        try {
            jwt.verify(token, key);
        } catch (error) {
            // console.log(error)
            return "Invalid token"
        }
    } else {
        return "Invalid token"
    }
    return "valid";
}

/*
    Route: /updatepost
    Description: update a post
    Access: private
*/
app.post("/updatepost/:p_id",(req,res)=>{
    const { token } = req.headers;
    if (validateToken(token) !== 'valid') { res.json({msg:"Invalid Token"});return}
    const postId = req.params.p_id;
    Posts.findByIdAndUpdate({_id:postId},{title:req.body.title},(error,post)=>{
        if(error) throw error;
        res.json({msg:"post updated successfully"});
    })
})

/*
    Route: /deletepost
    Description: delete a post
    Access: private
*/
app.post('/deletepost/:p_id',(req,res)=>{
    const { token } = req.headers;
    if (validateToken(token) !== 'valid') { res.json({msg:"Invalid Token"});return}
    Posts.findByIdAndDelete({_id:req.params.p_id},(error,post)=>{
        if(error) throw error;
        res.json({msg:"post deleted successfully",post});
    })

})
app.listen(port, (req, res) => {
    console.log(`server is running at ${port}`)
})