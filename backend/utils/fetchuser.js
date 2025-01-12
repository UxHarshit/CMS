// fetchUser.js
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';

try {
  const userWithProfile = await User.findOne({
    where: { username: 'harshit' },
    include: { model: UserProfile, as: 'profile' },
  });

  console.log('User with profile:', userWithProfile);
} catch (error) {
  console.error('Error fetching data:', error);
}
