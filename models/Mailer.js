const nodemailer = require("nodemailer");
const database = require('./Database')

async function main(){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 't7bgup36oqnoowdb@ethereal.email', // generated ethereal user
      pass: 'kZHn1C6cTCQDxMUS6M' // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "BROWAR ✔", // Subject line
    text: "Wszyscy wyrazili chęć na browar 🍺", // plain text body
    html: "<b>Wszyscy wyrazili chęć na browar 🍺</b>" // html body
  };

    module.exports.sender = async function () {
      let users = await database.getAllReady4BroEmail()
      users = users.map(ans => ans.email);
      console.log(users)
      mailOptions.to = users.join(',');
     
      return  await transporter.sendMail(mailOptions)

    } 

 // console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
 // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);