import { Router } from "express";

import * as linkRoutes from './link';
import * as adminRoutes from './admin';

const MainRouter: any = Router();

// mounting the routes on their specific endpoints
MainRouter.use('/link', linkRoutes);
MainRouter.use('/admin', adminRoutes);

module.exports = MainRouter;
