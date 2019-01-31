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
    
    return db.update({time:db.fn.now()})
            .into('lastbro')
            .then(a => {
                return db.select('*')
                .from('users')
                .where('ready4bro','=', true)
                .update({ready4bro: false})
                
            })
            .then(b => {
                return db('message').update({messagesend: false})
            } )
            
    
   

}


module.exports.messageSent = function() {
    return db('message').update({messagesend: true})
}

module.exports.checkMessageSent = function () {
    return db.select('messagesend').from('message')
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


