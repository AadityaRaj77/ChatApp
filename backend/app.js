require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken")

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
app.post('/login', async (req, res) => {
    const { roomname, password } = req.body
    try {
        const [rows] = await db.query(
            `SELECT * FROM rooms WHERE roomname = ?`,
            [roomname]
        );
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Room not found 🤡' });
        }
        else {
            room = rows[0];
            const isMatch = await bcrypt.compare(password, room.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password 🤣' });
            }
            else {
                const token = jwt.sign(
                    { roomId: room.id, roomname: room.roomname },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                )
                res.json({ message: 'Login successful 🗿', roomId: room.id, token });

            }
        }
    }
    catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

app.post('/room', verifyToken, async (req, res) => {
    const roomId = req.room.roomId;
    const roomname = req.room.roomname;
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [roomId]);

    if (rows.length === 0) {
        return res.status(404).json({ error: 'Room not found 🤡' });
    }

    res.json({
        message: `Welcome to room "${roomname}"`,
        room: rows[0]
    });

})


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})