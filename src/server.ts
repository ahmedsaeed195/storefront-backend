import express from 'express';
import dotenv from 'dotenv';
import router from './routes'
import cors from 'cors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req: express.Request, res: express.Response) => {
    return res.send('Hello World');
});

app.use('/api', router)

console.log(`Current environment: ${process.env.NODE_ENV}`)

const server = app.listen(PORT, (): void => console.log(`Listening on port ${PORT}`));

export default server