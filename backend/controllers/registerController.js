import { User, UserProfile, Institution } from '../models/index.js';
import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';


const registerController = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, password, institution } = req.body;
    const { code, value } = institution;

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