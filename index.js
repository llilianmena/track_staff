const db = require('./database/queries');

const programMap = {
  "View All Employees": async () => {
    const employees = await db.getAllEmployees();
    console.table(employees);
  },
  "Add Employee": async (answers) => {
    await db.addEmployee(answers);
  },
  "Update Employee Role": async (answers) => {
    await db.updateEmployeeRole(answers);
  },
  "View All Roles": async () => {
    const roles = await db.getAllRoles();
    console.table(roles);
  },
  "Add Role": async (answers) => {
    await db.addRole(answers);
  },
  "View All Departments": async () => {
    const departments = await db.getAllDepartments();
    console.table(departments);
  },
  "Add Department": async (answers) => {
    await db.addDepartment(answers);
  },
  "Quit": async (answers) => {
    // do nothing;
  },
};

var inquirer = require('inquirer');
const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
  },
  {
    type: 'input',
    name: 'departmentName',
    message: "What is the name of the department?",
    when: (answers) => answers.action === 'Add Department',
  },
  {
    type: 'input',
    name: 'roleName',
    message: "What is the name of the role?",
    when: (answers) => answers.action === 'Add Role',
  },
  {
    type: 'input',
    name: 'roleSalary',
    message: "What is the salary of the role?",
    when: (answers) => !!answers.roleName,
  },
  {
   type: "list",
   name: "roleDepartment",
   message: "What department is the role belong to?",
   choices: async () => {
    const departments = await db.getAllDepartments();
    return departments.map((department) => department.name);
   },
   when: (answers) => !!answers.roleSalary,
  },
  {
    type: 'input',
    name: 'employeeFirstName',
    message: "What is the employees first name?",
    when: (answers) => answers.action === 'Add Employee',
  },
  {
    type: 'input',
    name: 'employeeLastName',
    message: "What is the employees last name?",
    when: (answers) => !!answers.employeeFirstName,
  },
  {
    type: 'list',
    name: 'employeeRole',
    message: "What is the employees role?",
    choices: async () => {
      const roles = await db.getAllRoles();
      return roles.map((role) =>
        role.title
      );
    },
    when: (answers) => !!answers.employeeLastName,
  },
  {
    type: 'list',
    name: 'employeeManager',
    message: "Who is the employee's manager",
    choices: async () => {
      const employees = await db.getAllEmployees();
      return ['None', ...employees.map((employee) =>
        `${employee.first_name} ${employee.last_name}`
      )];
     },
    when: (answers) => !!answers.employeeRole,
  },
  {
    type: 'list',
    name: 'employeeToUpdate',
    message: "Which employee would you like to update?",
    choices: async () => {
      const employees = await db.getAllEmployees();
      return employees.map((employee) =>
        `${employee.first_name} ${employee.last_name}`
      );
     },
    when: (answers) => answers.action === 'Update Employee Role',
  },
  {
    type: 'list',
    name: 'employeeToUpdateNewRole',
    message: "Which role would you like to assign the selected employee?",
    choices: async () => {
      const roles = await db.getAllRoles();
      return roles.map((role) =>
        role.title
      );
    },
    when: (answers) => !!answers.employeeToUpdate,
  },

];


async function mainMenu() {
  let exit = false;
  while (!exit) {
    const answers = await inquirer.prompt(questions);
    if (answers.action === 'Quit') {
      console.log('Goodbye!');
      exit = true;
      break; // Optional, since exit will stop loop
    }

    // Call corresponding function
    await programMap[answers.action](answers);
    console.log('\nDone!\n');
  }
}

mainMenu().then(() => {
  process.exit();
});