import mysql2 from "mysql2/promise";

const pool = mysql2.createPoolCluster({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notes_app'
});

export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection established');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}