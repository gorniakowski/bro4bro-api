const knex = require('knex');

const db = knex ({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'gorniak',
        password: '',
        database: 'bro4bro'

    }
})


module.exports = db

module.exports.getAllReady4Bro = async function () {

    return await db.select('name').from('users')
        .where('ready4bro','=', true)
} 

module.exports.getAllReady4BroEmail = async function () {
    
    return await db.select('email').from('users')
        .where('ready4bro', '=', true)
}

module.exports.clockReset = function () {
    
    db.transaction(trx => {
        trx.update({time:db.fn.now()})
        .into('lastbro')
        
        trx.select('*')
            .from('users')
            .where('ready4bro','=', true)
            .update({ready4bro: false})

        trx.update({messagesend: false})
        .into('message')

        .then(trx.commit)
        .catch(trx.rollback)   
    })


module.exports.messageSent = function() {
    return db('message').update({messagesend: true})
}

module.exports.checkMessageSent = function () {
    db.select('messagesend').from('message')
}

module.exports.checkTeamReady =  function() {
    
    return module.exports.getAllReady4Bro().then(res=>{
        if (res.length >=1) {
           return true
        }else {
            return false
        }

    })
}  


    return db('lastbro')

            .update({time: db.fn.now()})



}