import Joi from 'joi';

export const userValidation = {
  create: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    name: Joi.string().min(1).max(100).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const boardValidation = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional().allow(''),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  }),
};

export const itemValidation = {
  create: Joi.object({
    boardId: Joi.string().required(),
    title: Joi.string().max(255).optional(),
    sourceUrl: Joi.string().uri().required(),
    imageUrl: Joi.string().uri().optional(),
    imageWidth: Joi.number().integer().min(1).optional(),
    imageHeight: Joi.number().integer().min(1).optional(),
  }),

  update: Joi.object({
    title: Joi.string().max(255).optional().allow(''),
    sourceUrl: Joi.string().uri().optional(),
  }),
};

export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('createdAt', 'updatedAt', 'name', 'position').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});