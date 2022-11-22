import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import routes from './src/routes';
import passport from './src/middlewares/passport';


const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());


const port = process.env.PORT;

app.use('/api', routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
