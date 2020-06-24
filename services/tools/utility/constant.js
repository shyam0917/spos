const config = require('dotenv').config();
console.log(process.env)
module.exports = {
  enumResponse: {
    0: 'Success',
    1: 'invalid data',
    2: 'insufficient data',
    3: 'not found' // sp  level
  },
  dbConnection: {
    user: process.env.dbuser,
    password: process.env.dbpassword,
    host: process.env.dbhost,
    port: process.env.dbport,
    database: process.env.dbdatabase,
    dateStrings: process.env.dbdateString,
  },
  directory: "",
  subDirectory: "/"
}