
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const articleRoutes = require('./routes/article-routes');
const localAuth = require('./config/local-auth');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');const cors = require('cors');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const socket = require('socket.io');
const SocketManager = require('./socketmanager');
const Article = require('./models/article-model');
const Question= require('./models/question-model');
const User = require('./models/user-model');
const Notif = require('./models/notification-model');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.keys]
// }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/article', articleRoutes);

mongoose.connect("mongodb://vijaicv:ucuredme@ds113179.mlab.com:13179/youcuredme", () => {
    console.log("connected to db");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.get('/feed',(req,res)=>{

//change this use populate or something!



    // var uid=req.query.uid;
    // var articles=[];
    // Article.find({pageName:"Diabetes"}).select({likedby:false}).limit(10).exec((err,result)=>{
    //     result.forEach(article => {
    //         Article.find({likedby:uid,_id:article._id}).select({_id:true}).then((result2)=>{
    //             console.log(result2.length);
    //             var r=article.toObject()
    //             if(result2.length==1)r.isliked=true
    //             else r.isliked=false
    //             User.find({_id:uid}).select({_id:0,name:1,avatar:1}).then((result)=>{
    //                 console.log(result)
    //                 r.author=result[0].name;
    //                 r.avatar=result[0].avatar;
    //                 articles.push(r);
    //             })
    //         })
    //     })
    //     Question.find({pageName:"Diabetes"}).limit(10).exec((err,result3)=>{
    //         var response={
    //             articles:articles,
    //             questions:result3
    //         }
    //         res.json(response)
    //     }) 
    // })   
})

app.get('/like',(req,res)=>{
    var aId=req.query.aid;
    var uid=req.query.uid;
    var iod=req.query.iod;

    console.log("aid="+aId+"uid= "+uid+"iod= "+iod);

    if(iod=="up"){
        Article.findOneAndUpdate({_id :aId}, {$inc : {'likes' : 1}, $push: { 'likedby': uid } }).then((data)=>{
            console.log("adding like")
            Article.likedby.push(uid)
            res.send("sucess");
        })
    }
    else{
        Article.findOneAndUpdate({_id :aId}, {$inc : {'likes' : -1}, $push: { 'likedby': uid } }).then((data)=>{
            console.log("removing like")
            Article.likedby.pull(uid);
            res.send("sucess");
        })
    }
    
})


app.get("/notification",(req,res)=>{
    var uid=req.query.uid;
    var dpos=req.query.dpos;//dismissPosition

    console.log(dpos)
    if(dpos=="load"){
        Notif.find({userid:uid}).exec((err,result)=>{
            res.json(result)
        })
    }
    else if(dpos=="All"){
        Notif.deleteMany({userid:uid}).exec((err,result)=>{
            if(err)res.send("failed")
            else res.send("success")
        })
    }
    else {
        Notif.findByIdAndDelete(dpos,(err,result)=>{
            if(err)res.send("failed")
            else res.send("success")
        })
    }
})

const server = app.listen(PORT, (err) => {
    if(err)throw err;
  console.log('app listening on port '+PORT);
})
const io = module.exports.io = socket(server);
io.on('connection', SocketManager);
