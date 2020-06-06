import express from 'express';
import routes from './routes';
import cors from 'cors';
import { resolve } from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

app.use(routes);

app.listen(3333);
