const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pwd = '123abc1';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pwd, salt, (err, hash) => {
        console.log(hash);
    })
});

const hashedpwd = '$2a$10$sinOqd/ZQIjbkAiezvC5IedrSpmWrwNVz9.gWc/8lbpzPto/V2Kwa';

bcrypt.compare(pwd, hashedpwd, (err, res) => {
    console.log(res);
})

// const data = {
//     id: 10
// };

// const token = jwt.sign(data, '123abc');
// console.log(token);
// const decoded = jwt.verify(token, '123abc');
// console.log(decoded);

// const msg = 'I am user number 4';
// const hash = SHA256(msg).toString();

// console.log(`Message ${msg}`);
// console.log(`Hash: ${hash}`);

// const data = {
//     id: 4
// };
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString()

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('Data was changed. Do not trust.')
// }
