const sql=require('mssql')

const config = {
    user: process.env.DB_USER,       
    password: process.env.DB_PASSWORD, 
    server: process.env.DB_SERVER,   
    database: process.env.DB_DATABASE, 
    port: parseInt(process.env.DB_PORT), 
    options: { 
        encrypt : process.env.DB_ENCRYPT==="true",
         trustedConnection :process.env.DB_TRUSTED_CONNECTION==="true", 
        trustServerCertificate: process.env.DB_TRUST_CERTIFICATE === "true",
        instanceName: process.env.DB_INSTANCE_NAME,  
        enableArithAbort: process.env.DB_ARITH_ABORT === "true" 
    },
    pool: {
        max: 10, 
        min: 0,  
        idleTimeoutMillis: 30000, 
      }
};

const dbConnections = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server successfully!");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

  module.exports=dbConnections;