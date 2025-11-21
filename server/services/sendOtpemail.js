const nodemailer = require('nodemailer');
require('dotenv').config();

const sendOtpMail = async (otp, email) => {
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
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
    };

    // ✅ must be inside the function
    const info = await transporter.sendMail(mailConfigurations);
    console.log('✅ OTP Sent Successfully:', info.response);

    return { success: true, info };

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendOtpMail;
