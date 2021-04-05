import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
} from '@sritkt/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments');
