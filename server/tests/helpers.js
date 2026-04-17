const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Book = require('../Models/books');

const JWT_SECRET = 'secret';

async function createUser(overrides = {}) {
  const password = overrides.password || 'password123';
  const user = await User.create({
    username: overrides.username || 'testuser',
    email: overrides.email || 'test@example.com',
    password: await bcrypt.hash(password, 10),
    role: overrides.role || 'user',
  });
  user._plainPassword = password;
  return user;
}

async function createAuthor(overrides = {}) {
  const user = await createUser({
    username: 'authoruser',
    email: 'author@example.com',
    role: 'author',
    ...overrides,
  });
  await User.findByIdAndUpdate(user._id, { authorName: 'Test Author', bio: 'Test bio' });
  return user;
}

function genToken(user) {
  return jwt.sign({ name: user.username, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
}

async function createNovel(authorId, overrides = {}) {
  return Book.create({
    title: overrides.title || 'Test Novel',
    author: overrides.author || 'Test Author',
    cover_image: 'https://example.com/cover.jpg',
    synopsis: 'A test synopsis',
    authorId,
    freeChapters: overrides.freeChapters !== undefined ? overrides.freeChapters : 3,
    chapterPrice: overrides.chapterPrice !== undefined ? overrides.chapterPrice : 5,
    genres: overrides.genres || [],
    tags: overrides.tags || [],
    ...overrides,
  });
}

module.exports = { createUser, createAuthor, genToken, createNovel };
