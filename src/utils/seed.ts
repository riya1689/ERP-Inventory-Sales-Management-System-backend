import { User } from '../modules/user/user.model';

export const seedDemoUsers = async () => {
  const demoUsers = [
    {
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'demoPassword123',
      role: 'Admin' as const,
    },
    {
      name: 'Demo Manager',
      email: 'manager@demo.com',
      password: 'demoPassword123',
      role: 'Manager' as const,
    },
    {
      name: 'Demo Employee',
      email: 'employee@demo.com',
      password: 'demoPassword123',
      role: 'Employee' as const,
    },
  ];

  try {
    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Seeded demo user: ${userData.email}`);
      }
    }
  } catch (error) {
    console.error('Error seeding demo users:', error);
  }
};
