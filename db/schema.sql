DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;


-- Create a table for the departments
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
)

-- Create a table for the roles
CREATE TABLE roles (
    id INT NOT AUTO_INCREMENT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(),
    dept_id INT
)

-- Create a table for the employees
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NUll,
    manager_id INT 
)