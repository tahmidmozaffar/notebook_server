import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express, { Express } from 'express';
import morgan from 'morgan';
import { initializeModels } from './src/models';
import passport from './src/middlewares/passport';
import routes from './src/routes';

const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
initializeModels();
app.use(passport.initialize());

const port = process.env.PORT;

app.use('/api', routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
