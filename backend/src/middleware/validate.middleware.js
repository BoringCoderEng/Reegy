// Why a generic reusable middleware: every route gets consistent error
// responses, and adding validation to a new route becomes a one-liner.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Invalid request", errors: result.error.flatten() });
    req.body = result.data;
    next();
  };
}

module.exports = validate;