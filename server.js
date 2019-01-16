const express = require('express');
const app = express ();
const cors = require ('cors');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const User = require ('./models/User');
const database = require('./models/Database');
const session = require('express-session'); 


const corsOptions = {
  origin: 'http://localhost:3001', //the port my react app is running on.
  credentials: true,
};



passport.use(new Strategy(
     function(email, password, cb){
        if (!User.validateEmail(email)){
          return cb(null, false)
        }
        if (password.length === 0){
          return cb(null, false)
        }
        User.loginCheck(email, password).then((result) => {
          if (!result ) {

            return cb(null, false)

          } else {
            User.getUser(email).then(data => {
              return cb(null, data[0])
            })

          }
        })             
   
    }
))

// serialize user object
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserialize user object
passport.deserializeUser(function (id, done) {
    User.getUserById(id).then((data, err) => {
      done(err, data)
    })
});


app.use(session({ secret: 'kotek',
                  resave: false,
                  saveUninitialized: true,
                  cookie: {maxAge:  3600000000,
                          secure: false}
                }));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());




app.get('/', (req, res) =>{
    database.select('time').from('lastbro')
    .then(time => res.status(200).json(time))
    .catch(err => res.status(400).json('Unable to receive timestamp ' + err))

    
})



 app.post('/login',
  // call passport authentication passing the "local" strategy name
  // THIS CALL RESPONDS WITH 400 OR 401 STATUS WITH NO DETAILS
  passport.authenticate('local'),

  // function to call once successfully authenticated
  function (req, res) {
    req.session.user = req.user;
    database.getAllReady4Bro()
    .then (result=>{ 
      const data = {
        user: req.user,
        broReady: result
      }
      res.status(200).json(data)})
    
  }); 


app.post ('/register', (req, res) =>{
    
    const {name, email, password} = req.body;
    User.Register(name, email, password)
    .then(valu => res.status(200).json(valu[0]))
  
    
    .catch(err =>{
      console.log(err)
      res.status(400).json(err)} )
  
})

app.post('/ready4bro', (req, res) =>{
  User.setBroReady(req.session.user.id)
  .then(result => {
    console.log(result);
    if (result === 1) {
      res.status(200).json('ok')
    }else {
      res.status(400).json('Somthing is wrong ? help me !')
    }
  })
  
})

app.post('/logout', (req, res) => {
  req.session.destroy();
})


app.listen (3000, () =>{
    console.log('App running on port 3000')
})


