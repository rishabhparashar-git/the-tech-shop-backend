const bcrypt = require("bcrypt");
const SALTROUNDS = 10;
async function passwordEncryptor(password) {
  //   console.log(password);
  const encryptedPassword = await bcrypt.genSalt(SALTROUNDS).then((salt) => {
    // console.log("salt prepared is", salt);
    return bcrypt.hash(password, salt);
  });
  return encryptedPassword;
  //   console.log("Hashed password is", encryptedPassword);
}
async function passwordValidator(password, hash) {
  return await bcrypt.compare(password, hash);
}
module.exports = { passwordEncryptor, passwordValidator };
