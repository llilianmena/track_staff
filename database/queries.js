const { pool } = require('./database');

const getAllDepartments = async () => {
  const query = `
    SELECT * FROM department;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getAllRoles = async () => {
  const query = `
    SELECT * FROM role;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getAllEmployees = async () => {
  const query = `
    SELECT * FROM employee;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getEmployeeByName = async (fullName) => {
  const [managerFirstName, managerLastName] = fullName.split(' ');
    const managerQuery = `
      SELECT id FROM employee
      WHERE first_name = $1 AND last_name = $2;
    `;
    const { rows } = await pool.query(managerQuery, [managerFirstName, managerLastName]);
    return rows[0];
};

const getRoleByTitle = async (title) => {
  const roleQuery = `
    SELECT id FROM role
    WHERE title = $1;
  `;
  const { rows } = await pool.query(roleQuery, [title]);
  return rows[0];
};

const getDepartmentByName = async (name) => {
  const departmentQuery = `
    SELECT id FROM department
    WHERE name = $1;
  `;
  const { rows } = await pool.query(departmentQuery, [name]);
  return rows[0];
};

const addEmployee = async (payload) => {
  let manager_id = null;
  if (payload.employeeManager !== 'None') {
    const employee = await getEmployeeByName(payload.employeeManager);
    manager_id = employee.id;
  };

  const role = await getRoleByTitle(payload.employeeRole);
  const role_id = role.id;

  const insertQuery = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ($1, $2, $3, $4);
  `;
  await pool.query(insertQuery, [payload.employeeFirstName, payload.employeeLastName, role_id, manager_id]);
};

const addRole = async (payload) => {
  const deparment = await getDepartmentByName(payload.roleDepartment);
  const department_id = deparment.id;

  const insertQuery = `
    INSERT INTO role (title, salary, department_id)
    VALUES ($1, $2, $3);
  `;
  await pool.query(insertQuery, [payload.roleName, payload.roleSalary, department_id]);
};

const addDepartment = async (payload) => {
  const insertQuery = `
    INSERT INTO department (name)
    VALUES
    ($1);
  `;
  await pool.query(insertQuery, [payload.departmentName]);
};

const updateEmployeeRole = async (payload) => {
  const employee = await getEmployeeByName(payload.employeeToUpdate);
  const employee_id = employee.id;
  const roleToUpdateTo = await getRoleByTitle(payload.employeeToUpdateNewRole);
  const role_id = roleToUpdateTo.id;

  const updateQuery = `
    UPDATE employee
    SET role_id = $1
    WHERE id = $2;
  `;
  await pool.query(updateQuery, [role_id, employee_id]);
};

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addEmployee,
  addRole,
  addDepartment,
  updateEmployeeRole,

};