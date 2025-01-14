import express from 'express';
import { env } from '../../env';

const app = express();
const PORT = env.PORT_MINIAPP;

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