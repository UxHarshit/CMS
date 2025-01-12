import {User} from './models/User.js';

(async () => {
  const user = await User.create({
    username: 'harshit',
    name: 'Harshit Katheria',
    email: 'harshit@example.com',
    password: 'securepassword',
  });

  const profile = await UserProfile.create({
    bio: 'Software Developer',
    twitter: 'https://twitter.com/harshit',
    linkedin: 'https://linkedin.com/in/harshit',
    github: 'https://github.com/UxHarshit',
    userId: user.id,
  });

  console.log('User and profile created:', user, profile);
})();
