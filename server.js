const cTable = require('console.table');
const Inquirer = require("inquirer");
const mysql = require("mysql2");
const express = require("express"); 
const inquirer = require('inquirer');
const { query } = require('express');


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
        viewDept();
      } else if (res.options === "View All Roles"){
        //display the roles table
        viewRoles();
      } else if (res.options === "View All Employees"){
        //display the employees table
        viewEmp();
      } else if (res.options === "Add a Department"){
        //add a department function
        addDept();
      } else if (res.options === "Add a Role"){
        //add a role function
        addRole();
      } else if (res.options === "Add an Employee"){
        //add an employee function
        addEmp();
      } else if (res.options === "Update an Employee Role"){
        //Update an employee function
        updateEmpRole();
      } else {
        //Quit 
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
  console.log(`Connected to the movies_db database.`)
);

async function viewDept(){
  await query("SELECT * FROM department", (error, result) => {
    try {
      console.log("\n");
      console.table(result);
      console.log("\n");
    } catch (error) {
      console.log(error);
    }
    //Return to original questions
    questions();
  });
}


async function viewRoles(){
  await query("SELECT * FROM roles", (error, result) => {
    try {
      console.log("\n");
      console.table(result);
      console.log("\n");
    } catch (error) {
      console.log(error);
    }
    questions();
  });
}

async function viewEmp(){
  await query("SELECT * FROM employee", (error, result) => {
    try {
      console.log("\n");
      console.table(result);
      console.log("\n");
    } catch (error) {
      console.log(error);
    }
    questions();
  });
}

async function addDept() {
  const result = await inquirer.prompt([
      {
          type: "input",
          name: "dept",
          message: "What is the name of the new department?",   
      }
  ]);

  const query = 'INSERT INTO department (name) VALUES (?)';

  db.query(query, result.dept, (err, results) => {

      if(err) throw err;
      
      console.log(`Successfully added new department: ${result.dept}.`);
      
  })
  questions();
}

async function addRole(){
  const result = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?"
    },
    {
      type: "input",
      name: "salary",
      message: "How much is the salary for the new role?"
    },
  ])
  const getDept = "SELECT * FROM department"
  const getResults = await db.promise().query(getDept);
  const department = getResults[0].map(({ id, name }) => ({value: id, name: name}));

  const chooseDept = await inquirer.prompt([
    {
      type: "list",
      name: "roleDepartment",
      message: "Which department does this role belong to?",
      choices: department
    }
  ])
  const query = "INSERT INTO roles (title, salary, departmend_id) VALUES (?, ?, ?)";
  db.query(query, [result.title, result.salary, chooseDept.roleDepartment], (err, results) => {
    try {
      console.log(`You have successfully added ${result.title}.`)
    } catch {
      console.log(err)
    }
  })
  questions();
}

async function addEmp(){
  const result = await inquirer.prompt([
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

  const rolesResult = await db.promise().query("SELECT id, title FROM role");
  const roles = rolesResult[0].map(({ id, title }) => ({value: id, name: name}));

  const askRole = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roles,
    }
  ])

  const setManager = await db.promise().query('SELECT first_name, last_name, manager_id FROM employee');
    const managers = setManager[0].map(({ first_name, last_name, manager_id }) => ({ value: manager_id, name: `${first_name} ${last_name}` }))

    // Add the option to select no manager, will return null
    managers.push({value: null, name: 'None'})

    const askManager = await inquirer.prompt([
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managers
        }
    ])

    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

    db.query(query, [result.first, result.last, askRole.role, askManager.manager], (err, results) => {

        if(err) throw err;
  
        console.log(`Successfully added new employee: ${result.first} ${result.last}.`);
        viewEmployees();
        
    })
  questions();
}

async function updateEmpRole(){
  const getEmployees = await db.promise().query("SELECT * FROM employees");
  const employees = employeeResults[0].map(({ id, first_name, last_name }) => ({ value: id, name: `${first_name} ${last_name}` }))

  const rolesResults = await db.promise().query('SELECT id, title FROM role');
  const roles = rolesResults[0].map(({ id, title }) => ({ value: id, name: title }))


  const result = await inquirer.prompt([
      {
          type: 'list',
          name: 'employee',
          message: "Which employee's role do you want to update?",
          choices: employees
      },
      {
          type: 'list',
          name: 'role',
          message: "Which role do you want to assign the selected employee?",
          choices: roles
      },

  ])

  const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
  db.query(query, [result.role, result.employee], (err, results) => {

      if(err) throw err;
     
      console.log('Successfully updated role!');
      
  })
  questions();
}

const endQuestions = () => {
  console.log("You have ended the program!")
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});