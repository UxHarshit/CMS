import { User, UserProfile, Institution } from '../models/index.js';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';
import axios from 'axios';
import qs from 'qs';


const registerController = async (req, res) => {
  try {
    const transaction = await sequelize.transaction();

    const { name, email, password, institution,token } = req.body;
    const { code, value } = institution;
    if (!token) {
      return res.status(400).send({ message: 'Token not provided.' });
    }

    const verifyUrl = "https://api.hcaptcha.com/siteverify";
    const secret = "ES_e6a9110ece8d4da49c9cfce9e4744028";

    const response = await axios.post(verifyUrl, qs.stringify({ secret, response: token }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.data.success) {
      console.log(response.data);
      return res.status(400).send({ message: 'Failed captcha verification.' });
    }


    if (!name || !email || !password) {
      return res.status(400).send({ message: 'Invalid request.' });

    }

    if (!code || !value) {
      return res.status(400).send({ message: 'Institution not provided.' });

    }

    const existingInstitution = await Institution.findOne({ where: { code } });
    if (!existingInstitution) {
      return res.status(400).send({ message: 'Institution not found.' });
    }

    const existingMail = await User.findOne({ where: { email } });
    if (existingMail) {
      return res.status(400).send({ message: 'Email already in use.' });
    }

    const username = await generateUniqueUsername(name);

    const user = await User.create({
      username,
      name,
      email,
      institutionId: existingInstitution.id,
      password: await bcrypt.hash(password, 10),
    }, { transaction });

    await UserProfile.create({
      userId: user.id,
    }, { transaction });

    await transaction.commit();

    res.status(201).send({ message: 'User registered successfully' });

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

async function generateUniqueUsername(name) {
  const baseName = name ? name.toLowerCase().replace(/\s+/g, '') : 'user';
  let username = baseName;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      isUnique = true;
    } else {
      username = `${baseName}${Math.floor(Math.random() * 1000)}`;
    }
  }

  return username;
}

export default registerController;