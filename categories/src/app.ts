import express from 'express';
import helmet from 'helmet';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@ramsy-dev/microservices-shop-common';
import { createCategoryRouter } from './routes/new';
import { showCategoryRouter } from './routes/show';
import { indexCategoryRouter } from './routes/index';
import { updateCategoryRouter } from './routes/update';
import { deleteCategoryRouter } from './routes/delete';

const { healthz } = require('express-healthz');


const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    name: 'shop',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(healthz);

app.use(currentUser);

app.use(createCategoryRouter);
app.use(showCategoryRouter);
app.use(indexCategoryRouter);
app.use(updateCategoryRouter);
app.use(deleteCategoryRouter);

// Catch all non defined urls
app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
