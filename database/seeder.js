// migrations/001_create_users_table.js
const { pool } = require('./database');

async function seedDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS department (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS role (
      id SERIAL PRIMARY KEY,
      title VARCHAR(30) UNIQUE NOT NULL,
      salary DECIMAL NOT NULL,
      department_id INT NOT NULL,
      FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS employee (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(30) UNIQUE NOT NULL,
      last_name VARCHAR(30) UNIQUE NOT NULL,
      role_id INT NOT NULL,
      manager_id INT,
      FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE CASCADE
    );
  `;

  const emptyExistingTablesQuery = `
    TRUNCATE TABLE department RESTART IDENTITY CASCADE;
    TRUNCATE TABLE role RESTART IDENTITY CASCADE;
    TRUNCATE TABLE employee RESTART IDENTITY CASCADE;
  `;

  const SeedQuery = `
    INSERT INTO department (name) VALUES
      ('Engineering'),
      ('Finance'),
      ('Legal'),
      ('Sales');

    INSERT INTO role (title, salary, department_id) VALUES
      ('Software Engineer', 100000, 1),
      ('Accountant', 80000, 2),
      ('Lawyer', 120000, 3),
      ('Salesperson', 60000, 4);
    
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
      ('Alice', 'Johnson', 1, NULL),
      ('Bob', 'Smith', 2, 1),
      ('Charlie', 'Brown', 3, 1),
      ('David', 'Williams', 4, 3),
      ('Eve', 'Davis', 4, 3),
      ('Frank', 'Miller', 1, 2),
      ('Grace', 'Moore', 2, 1),
      ('Hank', 'Young', 3, 1),
      ('Ivy', 'King', 4, 3),
      ('Jack', 'Adams', 4, 3);
     `;   

  try {
    await pool.query(createTableQuery);
    console.log('✅ Users table created successfully.');
    await pool.query(emptyExistingTablesQuery);
    console.log('✅ Existing tables emptied successfully.');
    await pool.query(SeedQuery);
    console.log('✅ Database seeded successfully.');
  } catch (err) {
    console.error('❌ Error running seeder', err);
  } finally {
    await pool.end(); // Close connection pool
  }
}

seedDatabase();
