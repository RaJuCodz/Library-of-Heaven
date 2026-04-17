jest.mock('../utils/bloomFilter');

const request = require('supertest');
const app = require('./testApp');
const { createUser, genToken, createNovel } = require('./helpers');
const User = require('../Models/user');

describe('User Routes', () => {
  describe('POST /api/v1/signup', () => {
    it('creates a new user', async () => {
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'newuser', email: 'new@example.com', password: 'password123' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully');
    });

    it('rejects username shorter than 4 chars', async () => {
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'ab', email: 'test@example.com', password: 'password123' });
      expect(res.status).toBe(400);
    });

    it('rejects invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'validuser', email: 'notanemail', password: 'password123' });
      expect(res.status).toBe(400);
    });

    it('rejects password shorter than 6 chars', async () => {
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'validuser', email: 'test@example.com', password: '123' });
      expect(res.status).toBe(400);
    });

    it('rejects duplicate username', async () => {
      await createUser({ username: 'dupeuser', email: 'dupe@example.com' });
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'dupeuser', email: 'other@example.com', password: 'password123' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Username already exists');
    });

    it('rejects duplicate email', async () => {
      await createUser({ username: 'user1', email: 'taken@example.com' });
      const res = await request(app)
        .post('/api/v1/signup')
        .send({ username: 'user2', email: 'taken@example.com', password: 'password123' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already exists');
    });
  });

  describe('POST /api/v1/signin', () => {
    it('signs in with valid credentials and returns token', async () => {
      await createUser({ username: 'loginuser', email: 'login@example.com', password: 'pass123' });
      const res = await request(app)
        .post('/api/v1/signin')
        .send({ username: 'loginuser', password: 'pass123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('role');
    });

    it('rejects unknown username', async () => {
      const res = await request(app)
        .post('/api/v1/signin')
        .send({ username: 'nobody', password: 'pass123' });
      expect(res.status).toBe(401);
    });

    it('rejects wrong password', async () => {
      await createUser({ username: 'loginuser2', email: 'login2@example.com' });
      const res = await request(app)
        .post('/api/v1/signin')
        .send({ username: 'loginuser2', password: 'wrongpassword' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/get_user_info', () => {
    it('returns user info without password when authenticated', async () => {
      const user = await createUser({ username: 'infouser', email: 'info@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .get('/api/v1/get_user_info')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('infouser');
      expect(res.body.password).toBeUndefined();
    });

    it('rejects request with no token', async () => {
      const res = await request(app).get('/api/v1/get_user_info');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/v1/become_author', () => {
    it('upgrades user role to author', async () => {
      const user = await createUser({ username: 'wannabe', email: 'wannabe@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .put('/api/v1/become_author')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ authorName: 'Great Author', bio: 'I write books' });
      expect(res.status).toBe(200);
      const updated = await User.findById(user._id);
      expect(updated.role).toBe('author');
      expect(updated.authorName).toBe('Great Author');
    });

    it('rejects missing authorName or bio', async () => {
      const user = await createUser({ username: 'wannabe2', email: 'wannabe2@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .put('/api/v1/become_author')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ authorName: 'Only Name' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/verify_password', () => {
    it('returns 200 for correct password', async () => {
      const user = await createUser({ username: 'verifyuser', email: 'verify@example.com', password: 'mypassword' });
      const token = genToken(user);
      const res = await request(app)
        .post('/api/v1/verify_password')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ password: 'mypassword' });
      expect(res.status).toBe(200);
    });

    it('returns 401 for wrong password', async () => {
      const user = await createUser({ username: 'verifyuser2', email: 'verify2@example.com', password: 'mypassword' });
      const token = genToken(user);
      const res = await request(app)
        .post('/api/v1/verify_password')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ password: 'wrongpassword' });
      expect(res.status).toBe(401);
    });
  });

  describe('Library Routes', () => {
    it('adds a book to library', async () => {
      const user = await createUser({ username: 'libuser', email: 'lib@example.com' });
      const novel = await createNovel(user._id);
      const token = genToken(user);
      const res = await request(app)
        .post('/api/v1/add_to_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .set('book_id', novel._id.toString());
      expect(res.status).toBe(200);
    });

    it('prevents adding same book twice', async () => {
      const user = await createUser({ username: 'libuser2', email: 'lib2@example.com' });
      const novel = await createNovel(user._id);
      const token = genToken(user);
      await request(app)
        .post('/api/v1/add_to_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .set('book_id', novel._id.toString());
      const res = await request(app)
        .post('/api/v1/add_to_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .set('book_id', novel._id.toString());
      expect(res.status).toBe(400);
    });

    it('returns library books', async () => {
      const user = await createUser({ username: 'libuser3', email: 'lib3@example.com' });
      const novel = await createNovel(user._id);
      const token = genToken(user);
      await request(app)
        .post('/api/v1/add_to_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .set('book_id', novel._id.toString());
      const res = await request(app)
        .get('/api/v1/get_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('removes a book from library', async () => {
      const user = await createUser({ username: 'libuser4', email: 'lib4@example.com' });
      const novel = await createNovel(user._id);
      const token = genToken(user);
      await request(app)
        .post('/api/v1/add_to_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .set('book_id', novel._id.toString());
      const res = await request(app)
        .delete('/api/v1/remove_from_library')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .set('book_id', novel._id.toString());
      expect(res.status).toBe(200);
    });
  });
});
