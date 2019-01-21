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
    return db('lastbro')
            .update({time: db.fn.now()})
            

}