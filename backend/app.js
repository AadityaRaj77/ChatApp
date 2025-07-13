require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs');
const mysql = require('mysql2')
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();


cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/register', async (req, res) => {
    const { roomname, password } = req.body
    try {
        const hashedpass = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            `INSERT INTO rooms (roomname, password) VALUES (?,?)`,
            [roomname, hashedpass]

        );
        res.status(201).json({ message: 'User inserted', userId: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Insert failed' });

    }
});


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})