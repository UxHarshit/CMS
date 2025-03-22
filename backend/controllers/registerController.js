import { User, UserProfile, Institution } from '../models/index.js';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';
import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const registerController = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    const { name, email, password, institution, token } = req.body;
    const { code, value } = institution;

    // **Early Return for Missing Fields**
    if (!token) return res.status(400).json({ message: 'Token not provided.' });
    if (!name || !email || !password) return res.status(400).json({ message: 'Invalid request.' });
    if (!code || !value) return res.status(400).json({ message: 'Institution not provided.' });

    // **Verify hCaptcha**
    const verifyUrl = "https://api.hcaptcha.com/siteverify";
    const secret = 'ES_e6a9110ece8d4da49c9cfce9e4744028'; // Move secret to .env
    const captchaResponse = await axios.post(verifyUrl, qs.stringify({ secret, response: token }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: 'Failed captcha verification.' });
    }

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
      institutionId: existingInstitution.id,
      password: await bcrypt.hash(password, 10),
    }, { transaction });

    await UserProfile.create({ userId: user.id }, { transaction });

    await transaction.commit(); // Commit the transaction

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    console.error("Register Error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
