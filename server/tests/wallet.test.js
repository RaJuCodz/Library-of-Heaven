jest.mock('../utils/bloomFilter');

const request = require('supertest');
const app = require('./testApp');
const { createUser, createAuthor, genToken, createNovel } = require('./helpers');
const Wallet = require('../Models/wallet');
const Chapter = require('../Models/chapter');

describe('Wallet Routes', () => {
  describe('GET /api/v1/get_wallet', () => {
    it('auto-creates and returns wallet with zero balance', async () => {
      const user = await createUser({ username: 'walletuser1', email: 'w1@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .get('/api/v1/get_wallet')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data.balance).toBe(0);
      expect(res.body.data.totalEarned).toBe(0);
      expect(res.body.data.totalSpent).toBe(0);
    });

    it('returns existing wallet on second call', async () => {
      const user = await createUser({ username: 'walletuser2', email: 'w2@example.com' });
      const token = genToken(user);
      await Wallet.create({ userId: user._id, balance: 50 });
      const res = await request(app)
        .get('/api/v1/get_wallet')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data.balance).toBe(50);
    });

    it('rejects unauthenticated request', async () => {
      const res = await request(app).get('/api/v1/get_wallet');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/buy_tokens', () => {
    it('adds tokens to wallet', async () => {
      const user = await createUser({ username: 'buyuser1', email: 'buy1@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .post('/api/v1/buy_tokens')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ amount: 100, paymentMethod: 'MockCard' });
      expect(res.status).toBe(200);
      expect(res.body.balance).toBe(100);
    });

    it('accumulates tokens across purchases', async () => {
      const user = await createUser({ username: 'buyuser2', email: 'buy2@example.com' });
      const token = genToken(user);
      await request(app)
        .post('/api/v1/buy_tokens')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ amount: 100 });
      const res = await request(app)
        .post('/api/v1/buy_tokens')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ amount: 50 });
      expect(res.body.balance).toBe(150);
    });

    it('returns 400 for amount of 0', async () => {
      const user = await createUser({ username: 'buyuser3', email: 'buy3@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .post('/api/v1/buy_tokens')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ amount: 0 });
      expect(res.status).toBe(400);
    });

    it('returns 400 for negative amount', async () => {
      const user = await createUser({ username: 'buyuser4', email: 'buy4@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .post('/api/v1/buy_tokens')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ amount: -50 });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/unlock_chapter/:chapterId', () => {
    it('returns 402 when wallet balance is insufficient', async () => {
      const author = await createAuthor({ username: 'unlockauth1', email: 'ua1@example.com' });
      const novel = await createNovel(author._id, { chapterPrice: 10 });
      const chapter = await Chapter.create({
        novelId: novel._id,
        chapterNumber: 1,
        title: 'Chapter 1',
        content: 'Content',
        isFree: false,
      });
      const user = await createUser({ username: 'unlockuser1', email: 'uu1@example.com' });
      await Wallet.create({ userId: user._id, balance: 5 });
      const token = genToken(user);
      const res = await request(app)
        .post(`/api/v1/unlock_chapter/${chapter._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(402);
    });

    it('unlocks chapter when user has enough tokens', async () => {
      const author = await createAuthor({ username: 'unlockauth2', email: 'ua2@example.com' });
      const novel = await createNovel(author._id, { chapterPrice: 5 });
      const chapter = await Chapter.create({
        novelId: novel._id,
        chapterNumber: 1,
        title: 'Chapter 1',
        content: 'Content',
        isFree: false,
      });
      const user = await createUser({ username: 'unlockuser2', email: 'uu2@example.com' });
      await Wallet.create({ userId: user._id, balance: 20 });
      const token = genToken(user);
      const res = await request(app)
        .post(`/api/v1/unlock_chapter/${chapter._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.balance).toBe(15);
    });

    it('returns 200 immediately for already-free chapter', async () => {
      const author = await createAuthor({ username: 'unlockauth3', email: 'ua3@example.com' });
      const novel = await createNovel(author._id);
      const chapter = await Chapter.create({
        novelId: novel._id,
        chapterNumber: 1,
        title: 'Free Chapter',
        content: 'Content',
        isFree: true,
      });
      const user = await createUser({ username: 'unlockuser3', email: 'uu3@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .post(`/api/v1/unlock_chapter/${chapter._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Chapter is already free!');
    });
  });

  describe('GET /api/v1/transaction_history', () => {
    it('returns empty history for new user', async () => {
      const user = await createUser({ username: 'histuser1', email: 'h1@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .get('/api/v1/transaction_history')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.totalPages).toBe(0);
    });

    it('returns transactions after buying tokens', async () => {
      const user = await createUser({ username: 'histuser2', email: 'h2@example.com' });
      const token = genToken(user);
      await request(app)
        .post('/api/v1/buy_tokens')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString())
        .send({ amount: 100 });
      const res = await request(app)
        .get('/api/v1/transaction_history')
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].type).toBe('purchase');
    });
  });

  describe('GET /api/v1/get_unlocked_chapters/:novelId', () => {
    it('returns empty array when no chapters are unlocked', async () => {
      const author = await createAuthor({ username: 'ulauth1', email: 'ulauth1@example.com' });
      const novel = await createNovel(author._id);
      const user = await createUser({ username: 'uluser1', email: 'uluser1@example.com' });
      const token = genToken(user);
      const res = await request(app)
        .get(`/api/v1/get_unlocked_chapters/${novel._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('id', user._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });
});
