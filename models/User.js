const bcrypt = require('bcrypt-nodejs');
const db = require('./Database')

module.exports.passwordCheck = function (email, password) {
    db.select('email', 'hash').from('login')
        .where('email','=', email)
        .then(data =>{
            if (data[0].hash === password){
                return true
            }else {
                return false
            }
        })
        .catch(err =>  err)

}

module.exports.Register = function(name, email, password) {
    const hash = bcrypt.hashSync(password);
    if (!validateEmail(email)){
        throw 'Wrong email'
    }
    if(name.length === 0) {
        throw 'Must provide name'
    }
    if (password.length === 0) {
        throw 'Password too short'
    }
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => console.log(err))
   

}

validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}