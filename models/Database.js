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

module.exports.clockReset = function () {
    
    db.transaction(trx => {
        trx.update({time:db.fn.now()})
        .into('lastbro')
        
        trx.select('*')
            .from('users')
            .where('ready4bro','=', true)
            .update({ready4bro: false})
        .then(trx.commit)
        .catch(trx.rollback)   
    })
    


    return db('lastbro')

            .update({time: db.fn.now()})



}