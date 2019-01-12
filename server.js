const express = require('express');
const app = express ();
const cors = require ('cors');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const User = require ('./models/User');
const db = require('./models/Database');
const session = require('express-session'); 





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



app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'kotek',
                  resave: false,
                  saveUninitialized: true
                }));
app.use(passport.initialize());
app.use(passport.session());




app.get('/', (req, res) =>{
    db.select('time').from('lastbro')
    .then(time => res.status(200).json(time))
    .catch(err => res.status(400).json('Unable to receive timestamp ' + err))

    
})



 app.post('/login',
  // call passport authentication passing the "local" strategy name
  // THIS CALL RESPONDS WITH 400 OR 401 STATUS WITH NO DETAILS
  passport.authenticate('local'),

  // function to call once successfully authenticated
  function (req, res) {
    req.session.save();
    req.session.user = req.user;
    res.status(200).json(req.user);
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
  console.log(req.session.id)
  res.status(200)
})



app.listen (3000, () =>{
    console.log('App running on port 3000')
})


