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
    -- Create Users table if not exists
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
    BEGIN
        CREATE TABLE Users (
            Id INT IDENTITY(1,1) PRIMARY KEY,
            Username VARCHAR(100) NOT NULL UNIQUE,
            Email VARCHAR(150) NOT NULL UNIQUE,
            PasswordHash VARCHAR(255) NOT NULL,
            Role VARCHAR(20) NOT NULL CHECK (Role IN ('student', 'shopkeeper')),
            CreatedAt DATETIME DEFAULT GETDATE()
        );
    END

    -- Create Menu table if not exists
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Menu')
    BEGIN
        CREATE TABLE Menu (
            Id INT IDENTITY(1,1) PRIMARY KEY,
            Name VARCHAR(100) NOT NULL,
            Price DECIMAL(10,2) NOT NULL,
            ShopName VARCHAR(50) NOT NULL,
            IsAvailable BIT DEFAULT 1,
            ImageUrl VARCHAR(255),
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
    END
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'orders')
    BEGIN
      CREATE TABLE Orders (
      Id INT IDENTITY(1,1) PRIMARY KEY,
      StudentUsername VARCHAR(100) NOT NULL,
      TotalAmount DECIMAL(10,2) NOT NULL,
      Status VARCHAR(50) DEFAULT 'Pending',
      CreatedAt DATETIME DEFAULT GETDATE()
    
      );
    END
    IF NOT EXISTS (SELECT * FROM sys.tables where name= 'OrderItems')
    BEGIN
    CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    FoodId INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (OrderId) REFERENCES Orders(Id)
);
END
`)

    console.log('✅ Database and table ready')
  })
  .catch((err) => {
    console.error('❌', err)
    process.exit(1)
  })
