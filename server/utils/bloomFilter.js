const { BloomFilter } = require('bloom-filters');
const User = require('../Models/user');

let usernameBloomFilter = null;

// Initialize the Bloom Filter
const initBloomFilter = async () => {
    try {
        console.log('[Bloom Filter] Initializing username bloom filter...');

        // Create a Bloom Filter with a capacity of 100,000 items and an error rate of 1%
        // Adjust size/error rate based on expected user base size
        usernameBloomFilter = BloomFilter.create(100000, 0.01);

        // Fetch all existing usernames from the database and add to the filter
        const users = await User.find({}, 'username').lean();

        users.forEach(user => {
            if (user.username) {
                usernameBloomFilter.add(user.username.toLowerCase());
            }
        });

        console.log(`[Bloom Filter] Successfully initialized with ${users.length} usernames.`);
    } catch (error) {
        console.error('[Bloom Filter] Error initializing bloom filter:', error);
    }
};

// Check if a username exists in the filter
const isUsernameInFilter = (username) => {
    if (!usernameBloomFilter) {
        console.warn('[Bloom Filter] Checked username before filter was initialized.');
        return false; // Fallback to safe side (maybe taken)
    }
    return usernameBloomFilter.has(username.toLowerCase());
};

// Add a new username to the filter
const addToBloomFilter = (username) => {
    if (usernameBloomFilter && username) {
        usernameBloomFilter.add(username.toLowerCase());
    }
};

module.exports = {
    initBloomFilter,
    isUsernameInFilter,
    addToBloomFilter
};
