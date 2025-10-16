import { appError } from '../utils/appError';

/**
 * Flexible validation middleware for body, query, or params
 * @param {Object} schemas - Object with optional `body`, `query`, `params` Joi schemas
 */
export const validate = (schemas) => (req, res, next) => {
  try {
    // Validate body if schema provided
    if (schemas.body) {
      const { error } = schemas.body.validate(req.body);
      if (error) return next(appError(error.details[0].message, 400));
    }

    // Validate query if schema provided
    if (schemas.query) {
      const { error } = schemas.query.validate(req.query);
      if (error) return next(appError(error.details[0].message, 400));
    }

    // Validate params if schema provided
    if (schemas.params) {
      const { error } = schemas.params.validate(req.params);
      if (error) return next(appError(error.details[0].message, 400));
    }

    next();
  } catch (err) {
    next(err);
  }
};
