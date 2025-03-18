import bcrypt from 'bcrypt';

const password = "Omsh@1104";


const hash = bcrypt.hashSync(password, 10);

console.log(hash);