const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./Models/user');
const Novel = require('./Models/books'); // We renamed the schema to Novel, but the file is books.js
const Chapter = require('./Models/chapter');
const Wallet = require('./Models/wallet');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.URI || 'mongodb://127.0.0.1:27017/library-of-heaven');
        console.log('Connected to DB');

        // Clean existing data
        await User.deleteMany({});
        await Novel.deleteMany({});
        await Chapter.deleteMany({});
        await Wallet.deleteMany({});

        console.log('Cleared existing data.');

        // Create a dummy author
        const author = new User({
            username: 'CelestialScribe',
            email: 'author@libraryofheaven.com',
            password: 'password123', // In a real app this is hashed
            address: '123 Heavenly Peak',
            role: 'author',
            penName: 'Divine Pen',
            isVerifiedAuthor: true
        });
        await author.save();

        // Create a dummy novel
        const novel = new Novel({
            title: 'Legend of the Dragon King',
            author: 'CelestialScribe',
            authorId: author._id,
            cover_image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop',
            synopsis: 'A tale of a young boy ascending to the heavens to become the ultimate sovereign. Cultivation, martial arts, and dragons await!',
            chapterPrice: 15,
            genres: ['Fantasy', 'Xianxia', 'Action'],
            status: 'ongoing',
            tags: ['Dragons', 'Cultivation', 'OP MC']
        });
        await novel.save();

        // Add chapters
        const chapters = [];
        for (let i = 1; i <= 5; i++) {
            const chapter = new Chapter({
                novelId: novel._id,
                chapterNumber: i,
                title: `The Awakening Part ${i}`,
                content: `This is the mystical content of chapter ${i}. The dragon's roar echoes across the valley...`,
                isFree: i <= 2 // First 2 chapters are free
            });
            await chapter.save();
            chapters.push(chapter._id);
        }

        novel.chapters = chapters;
        await novel.save();

        console.log('Dummy data seeded!');
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
