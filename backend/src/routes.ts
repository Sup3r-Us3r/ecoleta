import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import ItemsController from './app/controllers/ItemsController';
import PointsController from './app/controllers/PointsController';

const routes = Router();
const upload = multer(multerConfig);

// Items routes
routes.get('/items', ItemsController.getItems);

// Points routes
routes.get('/points/:id', PointsController.listPoint);
routes.get('/points', PointsController.listAllPoints);
routes.post('/points', upload.single('image'), PointsController.createPoint);

export default routes;
