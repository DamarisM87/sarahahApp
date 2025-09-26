export const validation = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];

    for (let key of Object.keys(schema)) {   // ✅ declare key properly
      const result = schema[key].validate(req[key], { abortEarly: false });

      if (result.error) {  // ✅ use result, not "data"
        validationErrors.push(result.error.details);
      }
    }

    if (validationErrors.length) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    return next();
  };
};
