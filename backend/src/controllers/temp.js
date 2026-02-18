import bcrypt from 'bcryptjs'

const hash = await bcrypt.hash('123098', 10)
console.log(hash)
