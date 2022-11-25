import nodeMailer from 'nodemailer';

const mailSender = nodeMailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAILER,
    pass: process.env.MAILER_PASSWORD,
  },
  secure: true
});

export const sendEmail = (toEmail: string, verificationCode: string) => {

  const mailData = {
    from: process.env.MAILER,
    to: toEmail,
    text: "The verification code is " + verificationCode,    
  };

  mailSender.sendMail(mailData, (error, info) => {
    if(error){
      console.log(error.message);
    }        
  });
}

export default sendEmail;
