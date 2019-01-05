const express = require('express');
const app = express ();
const cors = require ('cors');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const User = require ('./models/User');
const db = require('./models/Database');


passport.use(new Strategy(
    async function(email, password, cb){
        if (!User.validateEmail(email)){
          return cb(null, false)
        }
        if (password.length === 0){
          return cb(null, false)
        }

        if (await !User.loginCheck(email, password)){
          return cb(null, false)
        }

        return cb(null, {user: 'i am a user object'})
        
        
   
    }
))

// serialize user object
passport.serializeUser(function (user, done) {
  done(null, user);
});

// deserialize user object
passport.deserializeUser(function (user, done) {
  done(err, user);
});



app.use(cors());
app.use(bodyParser.json());
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
    res.status(200).send('logged in!');
  });


app.post ('/register', (req, res) =>{
    
    const {name, email, password} = req.body;
    User.Register(name, email, password)
    .then(valu => res.status(200).json(valu))
    .catch(err =>{
      console.log(err)
      res.status(400).json(err)} )
  
})



app.listen (3000, () =>{
    console.log('App running on port 3000')
})


