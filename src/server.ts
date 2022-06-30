import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.get('/', (req: express.Request, res: express.Response) => {
    return res.send('Hello World');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Listening on port ${PORT}`));
