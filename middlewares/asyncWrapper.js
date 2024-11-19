const asyncWrapper = async (next, cb) => {
  try {
    await cb();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

module.exports = asyncWrapper;
