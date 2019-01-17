const bcrypt = require('bcrypt-nodejs');
const db = require('./Database')

module.exports.loginCheck = function(email, password) {
   
    return new Promise(resolve => {
    db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
            if (data.length !== 0){
                resolve (bcrypt.compareSync(password, data[0].hash));
            }else{
                null
            }
        
        })
    
    

    })
}


module.exports.getUser = function(email) {
    return  db.select('*')
    .from('users')
    .where('email', '=', email)
    

    .catch(err => console.log(err))
}

module.exports.getUserById = function(id){
    return db.select('*')
    .from('users')
    .where('id', '=', id)
    
    .catch(err => err)

}

module.exports.setBroReady = function(id){
    return db('users')
    .where('id', '=', id)
    .update({ready4bro: true})
}
        



module.exports.Register =  function(name, email, password) {
    return new Promise((resolve, reject) => {
        const hash = bcrypt.hashSync(password);
        if (name.length === 0){
            reject('No name provided')
        }
        if (password.length === 0){
            reject('no password')
        }
        if(!this.validateEmail(email)){
            reject('no correct email ?')
        }
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')        
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user =>{
                    resolve(user);
                })
    
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        
            
            .catch(err => {
                console.log('ups'+err);
                reject('Shit!. Unable to register');
            }
            )
           


    })

}
    







module.exports.validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}