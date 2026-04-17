jest.mock('../utils/bloomFilter');

const request = require('supertest');
const app = require('./testApp');
const { createUser, createAuthor, genToken, createNovel } = require('./helpers');
const Book = require('../Models/books');

describe('Review Routes', () => {
  describe('POST /api/v1/add_review/:novelId', () => {
    it('adds a review to a novel', async () => {
      const author = await createAuthor({ username: 'ra1', email: 'ra1@example.com' });
      const user = await createUser({ username: 'ru1', email: 'ru1@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const res = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 5, comment: 'Amazing book!' });
      expect(res.status).toBe(200);
      expect(res.body.review.rating).toBe(5);
    });

    it('rejects rating below 1', async () => {
      const author = await createAuthor({ username: 'ra2', email: 'ra2@example.com' });
      const user = await createUser({ username: 'ru2', email: 'ru2@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const res = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 0 });
      expect(res.status).toBe(400);
    });

    it('rejects rating above 5', async () => {
      const author = await createAuthor({ username: 'ra3', email: 'ra3@example.com' });
      const user = await createUser({ username: 'ru3', email: 'ru3@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const res = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 6 });
      expect(res.status).toBe(400);
    });

    it('prevents a user from reviewing the same novel twice', async () => {
      const author = await createAuthor({ username: 'ra4', email: 'ra4@example.com' });
      const user = await createUser({ username: 'ru4', email: 'ru4@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 4 });
      const res = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 3 });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('You have already reviewed this novel');
    });

    it('updates novel average rating after review', async () => {
      const author = await createAuthor({ username: 'ra5', email: 'ra5@example.com' });
      const user = await createUser({ username: 'ru5', email: 'ru5@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 4 });
      const updated = await Book.findById(novel._id);
      expect(updated.rating).toBe(4);
      expect(updated.ratingCount).toBe(1);
    });

    it('rejects unauthenticated review', async () => {
      const author = await createAuthor({ username: 'ra6', email: 'ra6@example.com' });
      const novel = await createNovel(author._id);
      const res = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .send({ rating: 5 });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/get_reviews/:novelId', () => {
    it('returns paginated reviews for a novel', async () => {
      const author = await createAuthor({ username: 'ra7', email: 'ra7@example.com' });
      const user = await createUser({ username: 'ru7', email: 'ru7@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 5, comment: 'Great!' });
      const res = await request(app).get(`/api/v1/get_reviews/${novel._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.page).toBe(1);
    });

    it('returns empty list for novel with no reviews', async () => {
      const author = await createAuthor({ username: 'ra8', email: 'ra8@example.com' });
      const novel = await createNovel(author._id);
      const res = await request(app).get(`/api/v1/get_reviews/${novel._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('PUT /api/v1/update_review/:reviewId', () => {
    it('updates own review', async () => {
      const author = await createAuthor({ username: 'ra9', email: 'ra9@example.com' });
      const user = await createUser({ username: 'ru9', email: 'ru9@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const addRes = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 3, comment: 'OK' });
      const reviewId = addRes.body.review._id;
      const res = await request(app)
        .put(`/api/v1/update_review/${reviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 5, comment: 'Actually great!' });
      expect(res.status).toBe(200);
      expect(res.body.review.rating).toBe(5);
    });

    it('returns 403 when non-owner tries to update', async () => {
      const author = await createAuthor({ username: 'ra10', email: 'ra10@example.com' });
      const user = await createUser({ username: 'ru10', email: 'ru10@example.com' });
      const other = await createUser({ username: 'ro10', email: 'ro10@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const addRes = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 3 });
      const reviewId = addRes.body.review._id;
      const otherToken = genToken(other);
      const res = await request(app)
        .put(`/api/v1/update_review/${reviewId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .set('id', other._id.toString())
        .send({ rating: 1 });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/v1/delete_review/:reviewId', () => {
    it('deletes own review', async () => {
      const author = await createAuthor({ username: 'ra11', email: 'ra11@example.com' });
      const user = await createUser({ username: 'ru11', email: 'ru11@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const addRes = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 4 });
      const reviewId = addRes.body.review._id;
      const res = await request(app)
        .delete(`/api/v1/delete_review/${reviewId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
    });

    it('returns 403 when non-owner tries to delete', async () => {
      const author = await createAuthor({ username: 'ra12', email: 'ra12@example.com' });
      const user = await createUser({ username: 'ru12', email: 'ru12@example.com' });
      const other = await createUser({ username: 'ro12', email: 'ro12@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(user);
      const addRes = await request(app)
        .post(`/api/v1/add_review/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ rating: 4 });
      const reviewId = addRes.body.review._id;
      const otherToken = genToken(other);
      const res = await request(app)
        .delete(`/api/v1/delete_review/${reviewId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .set('id', other._id.toString());
      expect(res.status).toBe(403);
    });

    it('returns 404 for non-existent review', async () => {
      const user = await createUser({ username: 'ru13', email: 'ru13@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .delete('/api/v1/delete_review/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(404);
    });
  });
});
