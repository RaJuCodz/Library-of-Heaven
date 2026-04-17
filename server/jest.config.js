module.exports = {
  testEnvironment: 'node',
  setupFilesAfterFramework: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  moduleNameMapper: {
    '^cloudinary$': '<rootDir>/tests/__mocks__/cloudinary.js',
    '^multer-storage-cloudinary$': '<rootDir>/tests/__mocks__/multerStorageCloudinary.js',
    '^multer$': '<rootDir>/tests/__mocks__/multer.js',
  },
  testTimeout: 30000,
};
