import bcrypt from 'bcrypt';

//>>>>>Password hashing and verification:
const createHash = async (text) => {
    try {
        const hash = await bcrypt.hash(text, 10);
        return hash;
    } catch (err) {
        console.error(err);
    };
};

const verifyHash = async (password, hash) => {
    try {
      const match = await bcrypt.compare(password, hash);
      return match;
    } catch (err) {
      console.error(err);
    };
};
//>>>>>

export { createHash, verifyHash };