const bcrypt = require('bcrypt');

module.exports = {
  findOne: async ({ where: { email, id } }) => {
    if (email === 'wltks98@hanmail.net' || id === 1) {
      return {
        id: 1,
        email: 'wltks98@hanmail.net',
        password: await bcrypt.hash('nodejsbook', 12),
        Followers: [],
        Followings: [],
        addFollowing() {},
      };
    }
    return null;
  },
  create: async () => {},
};
