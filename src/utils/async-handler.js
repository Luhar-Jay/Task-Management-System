const asyncHandler = (requestHandler) => {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next)).catch(function (err) {
      return next(err);
    });
  };
};

export { asyncHandler };
