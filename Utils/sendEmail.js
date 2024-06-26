import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.MY_MAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailOptions = {
      from: process.env.MY_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(emailOptions);
    return info; 
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
};

export default sendEmail;
