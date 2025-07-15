require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require("./verifyToken")
const upload = require('./uploads')
const fs = require('fs')

const mysql = require('mysql2')
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();


cors = require('cors')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
app.use(cors())
app.use(express.json())
const port = 3000

io.on('connection', socket => {
    socket.on('join_room', room => {
        socket.join(room);
    })
    socket.on('send_message', data => {
        io.to(data.room).emit('receive_message', data);
    })

    socket.on('message-seen', async ({ messageId, viewer }) => {
        try {
            const [result] = await db.query(
                `UPDATE messages SET seen = 1 WHERE id=?`,
                [messageId]
            );

            io.emit('message-seen-confirmed', { messageId });
        }
        catch (err) {
            console.error('Seen update failed', err);

        }
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });


})


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

app.post('/messages', verifyToken, upload.single('media'), async (req, res) => {
    const { content } = req.body;
    const sender = req.room.roomname;
    const roomId = req.room.roomId;
    const file = req.file;

    const mediaURL = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    await db.query(
        'INSERT INTO messages (room_id, sender, content, media_url) VALUES (?, ?, ?, ?)',
        [roomId, sender, content, mediaURL]
    );

    res.json({ message: 'sent', mediaURL });
})

app.post('/messages/del', verifyToken, async (req, res) => {
    const messageId = req.params.id
    const currentRoom = req.room.roomname;
    const currentSender = req.room.roomname;
    try {
        const [rows] = await db.query(
            `SELECT * FROM messages WHERE id = ?`,
            [messageId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        else {
            const message = rows[0]
            if (message.sender !== currentSender) {
                return res.status(403).json({ error: 'Not authorized to delete this message' });
            }
            else {
                if (message.media_url) {
                    const mediaPath = path.join(__dirname, 'uploads', path.basename(message.media_url));

                    fs.unlink(mediaPath, (err) => {
                        if (err) {
                            console.error('Failed to delete media file:', err);
                        }
                        else {
                            console.log('Media file deleted:', mediaPath);
                        }
                    });
                }
                await db.query('DELETE FROM messages WHERE id = ?', [messageId]);
            }
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});



server.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})