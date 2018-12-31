const express = require('express');
const app = express ();
const knex = require('knex');
const cors = require ('cors');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');


passport.use(new Strategy(
    function(username, password, cb){
        db.select('email', 'hash').from('login')
        .where('email','=', username)
        .then(data =>{
            if (data[0].hash === password){
                return cb(null, 'SOme user data from user table')
            }else {
                return cb(null, false)
            }
        })
        .catch(err =>  cb(err))
   
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



const db = knex ({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'gorniak',
        password: '',
        database: 'bro4bro'

    }
})


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

app.listen (3000, () =>{
    console.log('App running on port 3000')
})


