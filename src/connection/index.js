const { Client } = require("pg");

const dbPoll = new Client({
  user: "postgres",
  database: "personal-web",
  password: "admin123",
  port: 5432,
});

module.exports = dbPoll;
