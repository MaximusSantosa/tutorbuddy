const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'santosa48862@sas.edu.sg',
  from: 'admin@tutorbuddy.com',
  subject: 'Sending with SendGrid is Fun and you baddd',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);