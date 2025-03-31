import { User, UserProfile, Institution } from '../models/index.js';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';
import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
import { sendMailCustom } from './emailController.js';

dotenv.config(); // Load environment variables

const registerController = async (req, res) => {

  try {
    const { token } = req.body; // Get the token from the request body
    if (!token) return res.status(400).json({ message: 'Captcha token is required.' });
    // **Verify hCaptcha**
    const verifyUrl = "https://api.hcaptcha.com/siteverify";
    const secret = 'ES_e6a9110ece8d4da49c9cfce9e4744028'; // Move secret to .env
    const captchaResponse = await axios.post(verifyUrl, qs.stringify({ secret, response: token }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: 'Failed captcha verification.' });
    }
    var ip =  req.ip;
    ip = ip.split(":").pop() || ip;
    ip = ip.trim().replace('::ffff:', '');
    
    const ipinfo = await axios.get(`https://ipapi.co/${ip}/json/`);
    const location = ipinfo.data['city'] + ', ' + ipinfo.data['region'] + ', ' + ipinfo.data['country_name'];

    const transaction = await sequelize.transaction(); // Start transaction

    try {
      const { name, email, password, institution } = req.body;
      const { code, value } = institution;

      // **Early Return for Missing Fields**

      if (!code || !value) return res.status(400).json({ message: 'Institution not provided.' });

      // **Check if Institution Exists**
      const existingInstitution = await Institution.findOne({ where: { code } });
      if (!existingInstitution) {
        return res.status(400).json({ message: 'Institution not found.' });
      }

      // **Check if Email Already Exists**
      const existingMail = await User.findOne({ where: { email } });
      if (existingMail) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

      // **Generate Unique Username**
      const username = await generateUniqueUsername(name);

      // **Create User and Profile in a Single Transaction**
      const user = await User.create({
        username,
        name,
        email,
        location : location || 'Unknown',
        institutionId: existingInstitution.id,
        password: await bcrypt.hash(password, 10),
      }, { transaction });

      await UserProfile.create({ userId: user.id }, { transaction });

      await transaction.commit(); // Commit the transaction

      await sendMailCustom(email, 'Welcome to CC Pro', `Hello ${name},\n welcome to CC Pro! We are glad to have you on board.\nIf you have any questions, feel free to reach out.`);

      return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
      await transaction.rollback(); // Rollback transaction on error
      console.error("Register Error:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error("Captcha Verification Error:", error);
    return res.status(500).json({ message: 'Captcha verification failed.' });
  }
};

// **Optimized Username Generator**
async function generateUniqueUsername(name) {
  const baseName = name ? name.toLowerCase().replace(/\s+/g, '') : 'user';
  const randomNum = Math.floor(Math.random() * 10000);
  let username = `${baseName}${randomNum}`;

  // Instead of looping, check once and regenerate if needed
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    username = `${baseName}${Math.floor(Math.random() * 100000)}`;
  }

  return username;
}

export default registerController;
