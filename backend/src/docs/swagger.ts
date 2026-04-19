import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import openapiDoc from './openapi.json';

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));
};
