const nodemailer = require('nodemailer');
const sql = require('mssql');
const dbConnections = require('../config/config'); // Ensure correct path

async function mailSender(to, subject, text) {
    try {
        const con = await dbConnections;
        const emailCreds = await con.request()
            .query('SELECT TOP 1 * FROM tblEmailCredentials'); 

        if (emailCreds.recordset.length === 0) {
            throw new Error("Email credentials not found");
        }

        const { sEmailAddress, sPassword, sHost, sPort, bSSL, bTLS } = emailCreds.recordset[0];

        
        
            const transporter = nodemailer.createTransport({
                host: sHost,
                port: sPort,
                secure: bSSL,
                auth: {
                    user: sEmailAddress,
                    pass: sPassword
                },
                tls: bTLS ? { rejectUnauthorized: false } : undefined
            });
      
        const mailOptions = {
            from: sEmailAddress,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent Successfully:", info);
        return { success: true, message: "Email sent successfully" };

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}

module.exports = mailSender;

