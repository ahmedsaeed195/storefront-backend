import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req: express.Request, res: express.Response) => {
    return res.send('Hello World');
});

console.log(process.env.NODE_ENV)

app.listen(PORT, (): void => console.log(`Listening on port ${PORT}`));
