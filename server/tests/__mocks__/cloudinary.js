module.exports = {
  v2: {
    config: jest.fn(),
    uploader: { upload: jest.fn().mockResolvedValue({ secure_url: 'https://mock.cloudinary.com/image.jpg' }) },
  },
};
