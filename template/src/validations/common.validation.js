import Joi from 'joi';

/**
 * Base reusable validators common across the project
 */

export const stringField = (
  min = 1,
  requiredMsg = 'Field is required',
  emptyMsg = 'Field cannot be empty'
) =>
  Joi.string()
    .trim()
    .min(min)
    .required()
    .messages({
      'string.base': 'Must be a string',
      'string.empty': emptyMsg,
      'string.min': `Must be at least ${min} characters long`,
      'any.required': requiredMsg,
    });

export const optionalString = (emptyMsg = 'Cannot be empty') =>
  Joi.string().trim().optional().messages({
    'string.base': 'Must be a string',
    'string.empty': emptyMsg,
  });

export const emailField = () =>
  Joi.string().email().trim().required().messages({
    'string.email': 'Must be a valid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  });

export const passwordField = (min = 6) =>
  Joi.string()
    .min(min)
    .required()
    .messages({
      'string.min': `Password must be at least ${min} characters long`,
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    });

export const objectIdField = () =>
  Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Must be a valid ObjectId',
      'any.required': 'ID is required',
    });
