const express = require('express');
const app = express ();
const knex = require('knex');
const cors = require ('cors');
const passport = require('passport');

app.use(cors());

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

app.listen (3000, () =>{
    console.log('App running on port 3000')
})


