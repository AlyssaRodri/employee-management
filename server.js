const cTable = require('console.table');
const Inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express");
const inquirer = require('inquirer');
const { query } = require('express');


const questions = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "task",
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
  ]).then(function (res) {
    if (res.task === "View All Departments") {
      //display the department table
      //console.log(testing) <= Testing to make sure that this part of the code was working
      viewDept();
    } else if (res.task === "View All Roles") {
      //display the roles table
      console.log("testing")
      viewRoles();
    } else if (res.task === "View All Employees") {
      //display the employees table
      viewEmp();
    } else if (res.task === "Add a Department") {
      //add a department function
      addDept();
    } else if (res.task === "Add a Role") {
      //add a role function
      addRole();
    } else if (res.task === "Add an Employee") {
      //add an employee function
      addEmp();
    } else if (res.task === "Update an Employee Role") {
      //Update an employee function
      updateEmpRole();
    } else if (res.task === "Quit") {
      endQuestions();
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
  console.log(`Connected to the company_db database.`)
);

function viewDept() {
  db.query("SELECT * FROM department", (error, result) => {
    try {
      console.table(result);
      // console.log(result)
      endQuestions()
    } catch (error) {
      console.log(error);
    }
  });
}


function viewRoles() {
  db.query("SELECT * FROM role", (error, result) => {
    try {
      // console.log("testing2")
      console.table(result)
      endQuestions()
    } catch (error) {
      console.log(error)
    }
  });
}

function viewEmp() {
  db.query("SELECT * FROM employee", (error, result) => {
    try {
      console.table(result);
      endQuestions()
    } catch (error) {
      console.log(error);
    }
  });
}

function addDept() {
  inquirer.prompt([
    {
      type: "input",
      name: "department_name",
      message: "What is the name of the new department?",
    }
  ]).then((response) => {
    console.log(response)
    const query = 'INSERT INTO department (dept_name) VALUES (?)'
    db.query(query, response.department_name, (err, results) => {
      console.log("Success.")
      viewDept()
      })
    })
}

async function addRole() {
  const roleResults = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the new role?"
    },
    {
      type: "input",
      name: "salary",
      message: "How much is the salary for the new role?"
    },
  ])
  //Create a query to get all of the data bases for the next question
  const deptQuery = "SELECT id, dept_name FROM department"    
  const queryResults = await db.promise().query(deptQuery)
  // console.log(queryResults)
  // const deptList = Object.values(queryResults)
  const deptList = queryResults[0].map(({ id, dept_name }) => ({value: id, name: dept_name}));
  // console.log(deptList)

  const askDept = await inquirer.prompt([
    {
      type: 'list',
      name: "dept",
      message: "Which department does this new role belong to?",
      choices: deptList
    }
  ])
  try {
    const insertQuery = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)"
    console.log(roleResults.title, roleResults.salary, askDept.dept)
    db.query(insertQuery, [roleResults.title, roleResults.salary, askDept.dept])  
    console.log("Success.")
    viewRoles()
  } catch (error) {
    console.log(error)
  }
       
}

async function addEmp() {
  const empName = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
  const roleQuery = "SELECT id, title FROM role"    
  const queryResultsRole = await db.promise().query(roleQuery)
  // console.log(queryResults)
  // const deptList = Object.values(queryResults)
  const roleList = queryResultsRole[0].map(({ id, title }) => ({value: id, name: title}));
  console.log(roleList)
  const askRole = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roleList
    }
  ])

  const managerQuery = 'SELECT first_name, last_name, manager_id FROM employee'
  const queryResultsManager = await db.promise().query(managerQuery);
  const managerList = queryResultsManager[0].map(({ first_name, last_name, manager_id }) => ({ value: manager_id, name: `${first_name} ${last_name}` }))

  // Add the option to select no manager, will return null
  managerList.push({ value: null, name: 'None' })

  const askManager = await inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: "Who is the employee's manager?",
      choices: managerList
    }
  ])
  try {
    console.log(empName.first_name, empName.last_name, askRole.role, askManager.manager)
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    db.query(query, [empName.first_name, empName.last_name, askRole.role, askManager.manager], (err, results))
    viewEmp()
  } catch (error) {
    console.log(error)
  }
}

async function updateEmpRole() {
  const empQuery = await db.promise().query("SELECT id, first_name, last_name FROM employee");
  const empList = empQuery[0].map(({ id, first_name, last_name }) => ({ value: id, name: first_name, last_name }))

  const rolesQuery = await db.promise().query('SELECT id, title FROM role');
  const roleList = rolesQuery[0].map(({ id, title }) => ({ value: id, name: title }))


  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: "Which employee's role do you want to update?",
      choices: empList
    },
    {
      type: 'list',
      name: 'role',
      message: "Which role do you want to assign the selected employee?",
      choices: roleList
    },

  ])
  try {
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    db.query(query, [result.role, result.employee], (err, results))
    console.log('Successfully updated role!');
    viewEmp()
  } catch (error) {
    
  }

  
}

const endQuestions = () => {
  inquirer
    .prompt([
      {
        name: "moreQuery",
        type: "confirm",
        message: "Are you finished?",
      },
    ])
    .then((answer) => {
      if (answer.moreQuery == true){
        db.end()
      } else {
        questions()
      }
    });
}

questions();