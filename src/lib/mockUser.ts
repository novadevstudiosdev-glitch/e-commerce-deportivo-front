export type UserRole = 'user' | 'admin';

export const mockUser = {
  id: 'user-001',
  firstName: 'Carla',
  lastName: 'Miranda',
  email: 'carla@sportshop.com',
  phone: '+54 9 11 5555 5555',
  role: 'user' as UserRole,
};
