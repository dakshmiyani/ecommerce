const nodemailer = require('nodemailer');
require('dotenv').config();

const verifyEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Email Verification',
      text: `Hi there!

You recently registered on our website. Please verify your email by clicking the link below:

http://localhost:5173/verify/${token}

Thanks,`
    };

    // ✅ must be inside the function
    const info = await transporter.sendMail(mailConfigurations);
    console.log('✅ Email Sent Successfully:', info.response);

    return { success: true, info };

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = verifyEmail;
