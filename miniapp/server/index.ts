import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const PORT = process.env.PORT_MINIAPP;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MiniApp</title>
        </head>
        <body>
            <h1>Добро пожаловать в MiniApp!</h1>
            <p>Это простое мини-приложение.</p>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`MiniApp is running on http://localhost:${PORT}`);
})