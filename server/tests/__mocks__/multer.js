const multer = () => ({
  single: () => (req, res, next) => next(),
  array: () => (req, res, next) => next(),
  fields: () => (req, res, next) => next(),
});
multer.diskStorage = jest.fn();
module.exports = multer;
