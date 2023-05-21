import bcrypt from 'bcryptjs';

export const data = {
  users: [
    {
      userName: 'sai',
      email: 'bhaskarpotala@gmail.com',
      password: bcrypt.hashSync('dsaRevision@9440319767', 8),
      isAdmin: true,
    },
    {
      userName: 'test',
      email: 'test@gmail.com',
      password: bcrypt.hashSync('test@9440319767', 8),
    },
  ],
};
