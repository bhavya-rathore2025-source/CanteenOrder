import sql from 'mssql'
/*
USE credentials;
CREATE LOGIN node_user 
WITH PASSWORD = 'StrongPass@123';
CREATE USER node_user FOR LOGIN node_user;
ALTER ROLE db_owner ADD MEMBER node_user;
*/
const config = {
  user: 'node_user',
  password: 'StrongPass@123',
  server: 'DESKTOP-5EU8KIE\\SQLEXPRESS',
  database: 'Test1',
  port: 1433,
  options: {
    trustServerCertificate: true,
  },
}

export const poolPromise = new sql.ConnectionPool(config)

poolPromise
  .connect()
  .then(async (pool) => {
    console.log('✅ Connected to SQL Server')
    // Create users table if not exists
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(100) NOT NULL UNIQUE,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL CHECK (Role IN ('student', 'shopkeeper')),
    CreatedAt DATETIME DEFAULT GETDATE()
);

    `)
    console.log('✅ Database and table ready')
  })
  .catch((err) => {
    console.error('❌', err)
    process.exit(1)
  })
