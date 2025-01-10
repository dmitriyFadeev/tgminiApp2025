import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv'; 
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BOT || 3000;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const token = process.env.BOT_TOKEN;
const miniappUrl = process.env.BOT_MINI_APP_URL
//const botUrl = process.env.BOT_APP_URL
if (!token || !miniappUrl) {
    throw new Error('no bot token or miniapp url provided');
}
const bot = new Telegraf(token);
const photoPath = path.join(dirname, 'images', 'image.jpg'); 

// Обработка команды /start
bot.start(async (ctx) => {
    if (!fs.existsSync(photoPath)) {
        await ctx.reply('Изображение не найдено.');
        return;
    }

    const caption = 'кук11222111ExpertHub - Объединяет предпринимателей и экспертов в безопасное бизнес-сообщество с профилями участников, тематическими чатами, календарем событий и уникальными нетворкинг-мероприятиями. Всё для удобного общения и развития вашего бизнеса.';

    const options = Markup.inlineKeyboard([
        [
            Markup.button.webApp('Запустить', miniappUrl),
            //Markup.button.url('Запустить', miniappUrl),
        ],
    ]);

    await ctx.replyWithPhoto(
        { source: photoPath },
        {
            caption: caption,
            reply_markup: options.reply_markup
        }
    );
});

// Статические файлы и API
app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('API is running!');
});

// Запуск сервера и бота
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

bot.launch().then(() => {
    console.log('Бот запущен');
}).catch((err) => {
    console.error('Ошибка запуска бота:', err);
});