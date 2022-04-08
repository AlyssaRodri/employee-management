const cTable = require('console.table');
const Inquirer = require("inquirer");
const mysql = require("mysql2");



const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'potato',
      database: 'movies_db'
    },
    console.log(`Connected to the movies_db database.`)
  );