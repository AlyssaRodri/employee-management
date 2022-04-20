INSERT INTO department (dept_name)
VALUES  ("Human Resources"),
        ("Legal"),
        ("Accounting"),
        ("Sales"),
        ("General Management");


INSERT INTO role (title, salary, department_id)
VALUES  ("HR Director", 60000, 1),
        ("Junior Sales Associate", 40000, 4),
        ("General Manager", 45000, 5),
        ("Payroll Generalist", 50000, 3),
        ("Lawyer", 120000, 2),
        ("Paralegal", 45000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Gary", "Almes", 3, null),
        ("Alyssa", "Rodriguez", 1, 1),
        ("Molly", "Landon", 5, null),
        ("Jessica", "Brown", 6, 3);