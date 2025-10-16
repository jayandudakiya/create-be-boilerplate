import Joi from 'joi';
import {
  emailField,
  optionalString,
  passwordField,
  stringField,
} from './common.validation';

/**
 * Example: Solid user creation validation (reference)
 */
export const createUserValidation = Joi.object({
  user_name: stringField(
    3,
    'User name is required',
    'User name cannot be empty'
  ),
  first_name: stringField(
    1,
    'First name is required',
    'First name cannot be empty'
  ),
  last_name: stringField(
    1,
    'Last name is required',
    'Last name cannot be empty'
  ),
  email: emailField(),
  password: passwordField(8),

  avatar: optionalString(),
});

/**
 * Example: Update user validation (optional fields)
 */
export const updateUserValidation = Joi.object({
  user_name: optionalString(),
  first_name: optionalString(),
  last_name: optionalString(),
  role: Joi.string().valid('ADMIN', 'SALES', 'PM', 'CUSTOMER').optional(),
  isEmailVerified: Joi.boolean().optional(),
  points: Joi.number().integer().optional().messages({
    'number.base': 'Points must be a number',
    'number.integer': 'Points must be an integer',
  }),
});
