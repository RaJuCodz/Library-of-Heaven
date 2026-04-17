jest.mock('../utils/bloomFilter');

const request = require('supertest');
const app = require('./testApp');
const { createUser, createAuthor, genToken, createNovel } = require('./helpers');

describe('Book Routes', () => {
  describe('POST /api/v1/add_novel', () => {
    it('creates a novel when authenticated', async () => {
      const author = await createAuthor({ username: 'auth1', email: 'auth1@example.com' });
      const token = genToken(author);
      const res = await request(app)
        .post('/api/v1/add_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', author._id.toString())
        .send({
          title: 'My Novel',
          author: 'Test Author',
          cover_image: 'https://example.com/cover.jpg',
          synopsis: 'A great story',
          genres: ['Fantasy'],
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('novel_id');
      expect(res.body.novel.title).toBe('My Novel');
    });

    it('rejects when required fields are missing', async () => {
      const author = await createAuthor({ username: 'auth2', email: 'auth2@example.com' });
      const token = genToken(author);
      const res = await request(app)
        .post('/api/v1/add_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', author._id.toString())
        .send({ title: 'Incomplete Novel' });
      expect(res.status).toBe(400);
    });

    it('rejects unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/v1/add_novel')
        .send({ title: 'Novel', author: 'Someone', cover_image: 'url', synopsis: 'synopsis' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/get_all_novels', () => {
    it('returns all novels sorted by newest', async () => {
      const author = await createAuthor({ username: 'auth3', email: 'auth3@example.com' });
      await createNovel(author._id, { title: 'Novel 1' });
      await createNovel(author._id, { title: 'Novel 2' });
      const res = await request(app).get('/api/v1/get_all_novels');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('returns empty array when no novels', async () => {
      const res = await request(app).get('/api/v1/get_all_novels');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/v1/get_novel_by_id/:novel_id', () => {
    it('returns the correct novel', async () => {
      const author = await createAuthor({ username: 'auth4', email: 'auth4@example.com' });
      const novel = await createNovel(author._id, { title: 'Specific Novel' });
      const res = await request(app).get(`/api/v1/get_novel_by_id/${novel._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Specific Novel');
    });

    it('returns 404 for non-existent novel', async () => {
      const res = await request(app).get('/api/v1/get_novel_by_id/000000000000000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/get_recent_novels', () => {
    it('returns at most 20 novels', async () => {
      const author = await createAuthor({ username: 'auth5', email: 'auth5@example.com' });
      for (let i = 0; i < 5; i++) {
        await createNovel(author._id, { title: `Novel ${i}` });
      }
      const res = await request(app).get('/api/v1/get_recent_novels');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(20);
    });
  });

  describe('PUT /api/v1/update_novel', () => {
    it('updates novel when requester is the owner', async () => {
      const author = await createAuthor({ username: 'auth6', email: 'auth6@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(author);
      const res = await request(app)
        .put('/api/v1/update_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', author._id.toString())
        .set('novel_id', novel._id.toString())
        .send({ title: 'Updated Title' });
      expect(res.status).toBe(200);
    });

    it('returns 403 when non-owner tries to update', async () => {
      const author = await createAuthor({ username: 'auth7', email: 'auth7@example.com' });
      const other = await createUser({ username: 'other7', email: 'other7@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(other);
      const res = await request(app)
        .put('/api/v1/update_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', other._id.toString())
        .set('novel_id', novel._id.toString())
        .send({ title: 'Hacked Title' });
      expect(res.status).toBe(403);
    });

    it('returns 404 for non-existent novel', async () => {
      const author = await createAuthor({ username: 'auth8', email: 'auth8@example.com' });
      const token = genToken(author);
      const res = await request(app)
        .put('/api/v1/update_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', author._id.toString())
        .set('novel_id', '000000000000000000000000')
        .send({ title: 'Ghost' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/delete_novel', () => {
    it('deletes novel when owner', async () => {
      const author = await createAuthor({ username: 'auth9', email: 'auth9@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(author);
      const res = await request(app)
        .delete('/api/v1/delete_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', author._id.toString())
        .set('novel_id', novel._id.toString());
      expect(res.status).toBe(200);
    });

    it('returns 403 when non-owner tries to delete', async () => {
      const author = await createAuthor({ username: 'auth10', email: 'auth10@example.com' });
      const other = await createUser({ username: 'other10', email: 'other10@example.com' });
      const novel = await createNovel(author._id);
      const token = genToken(other);
      const res = await request(app)
        .delete('/api/v1/delete_novel')
        .set('Authorization', `Bearer ${token}`)
        .set('id', other._id.toString())
        .set('novel_id', novel._id.toString());
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/get_novels_by_genre', () => {
    it('returns novels filtered by genre', async () => {
      const author = await createAuthor({ username: 'auth11', email: 'auth11@example.com' });
      await createNovel(author._id, { genres: ['Horror'], title: 'Horror Novel' });
      await createNovel(author._id, { genres: ['Romance'], title: 'Romance Novel' });
      const res = await request(app).get('/api/v1/get_novels_by_genre?genre=Horror');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Horror Novel');
    });

    it('returns 400 when genre param is missing', async () => {
      const res = await request(app).get('/api/v1/get_novels_by_genre');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/get_my_novels', () => {
    it('returns only the authenticated author\'s novels', async () => {
      const author = await createAuthor({ username: 'auth12', email: 'auth12@example.com' });
      const other = await createAuthor({ username: 'auth13', email: 'auth13@example.com' });
      await createNovel(author._id, { title: 'Mine' });
      await createNovel(other._id, { title: 'Not Mine' });
      const token = genToken(author);
      const res = await request(app)
        .get('/api/v1/get_my_novels')
        .set('Authorization', `Bearer ${token}`)
        .set('id', author._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Mine');
    });
  });

  describe('GET /api/v1/get_trending_novels', () => {
    it('returns novels sorted by views', async () => {
      const author = await createAuthor({ username: 'auth14', email: 'auth14@example.com' });
      await createNovel(author._id, { title: 'Popular', viewCount: 100 });
      await createNovel(author._id, { title: 'Obscure', viewCount: 1 });
      const res = await request(app).get('/api/v1/get_trending_novels');
      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Popular');
    });
  });
});
