const cTable = require('console.table');
const Inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express"); 
const inquirer = require('inquirer');


const questions = () => {
  inquirer.prompt([
    {
      type: "List",
      name: "Task",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit",
    ]
    }
  ]).then((res) => {
      if(res.options === "View All Departments"){
        //display the department table
      } else if (res.options === "View All Roles"){
        //display the roles table
      } else if (res.options === "View All Employees"){
        //display the employees table
      } else if (res.options === "Add a Department"){
        //add a department function
      } else if (res.options === "Add a Role"){
        //add a role function
      } else if (res.options === "Add an Employee"){
        //add an employee function
      } else if (res.options === "Update an Employee Role"){
        //Update an employee function
      } else {
        //Quit 
      }
  })
}

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'potato',
    database: 'company_db'
  },
  console.log(`Connected to the movies_db database.`)
);




// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});