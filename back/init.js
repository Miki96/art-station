const crypto = require('crypto');
const redis = require('redis');
const client = redis.createClient();

// Redis
client.on('connect', function() {
    console.log('Redis client connected');
    let id;
    let token;
    let email;
    let pass;
    let author;

    // User 1
    id = 1;
    token = crypto.randomBytes(20).toString('hex');
    email = 'taki@mail.com';
    pass = '12345678';
    client.hmset('user:' + id, [
        'username', 'takiMaki',
        'email', email,
        'password', pass,
        'fname', 'Tamara',
        'lname', 'Takic',
        'date', '2.3.1999.',
        'token', token,
        'avatar', 'images/avatars/av1.png'
    ]);
    client.lpush('users', id);
    client.hset('emails', email, id);
    // User 2
    id = 2;
    token = crypto.randomBytes(20).toString('hex');
    email = 'miki@mail.com';
    pass = '12345678';
    client.hmset('user:' + id, [
        'username', 'mikiTheUser',
        'email', email,
        'password', pass,
        'fname', 'Miki',
        'lname', 'Mikic',
        'date', '11.7.1981.',
        'token', token,
        'avatar', 'images/avatars/av2.png'
    ]);
    client.lpush('users', id);
    client.hset('emails', email, id);
    // User 3
    id = 3;
    token = crypto.randomBytes(20).toString('hex');
    email = 'igi@mail.com';
    pass = '12345678';
    client.hmset('user:' + id, [
        'username', 'superArtist',
        'email', email,
        'password', pass,
        'fname', 'Igor',
        'lname', 'Stosic',
        'date', '9.2.1995.',
        'token', token,
        'avatar', 'images/avatars/av3.png'
    ]);
    client.lpush('users', id);
    client.hset('emails', email, id);
    // Set ID
    client.set('id', 4);

    // Drawing 0
    id = 6;
    author = 1;
    client.hmset('drawing:' + id, [
        'title', 'Smiley',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 1
    id = 9;
    author = 3;
    client.hmset('drawing:' + id, [
        'title', 'Line',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 2
    id = 10;
    author = 2;
    client.hmset('drawing:' + id, [
        'title', 'Worm',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 3
    id = 12;
    author = 3;
    client.hmset('drawing:' + id, [
        'title', 'Taky',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 4
    id = 13;
    author = 1;
    client.hmset('drawing:' + id, [
        'title', 'Sun',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 5
    id = 14;
    author = 2;
    client.hmset('drawing:' + id, [
        'title', 'Baymax',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 6
    id = 15;
    author = 3;
    client.hmset('drawing:' + id, [
        'title', 'Figure',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 7
    id = 16;
    author = 1;
    client.hmset('drawing:' + id, [
        'title', 'Bang Bang',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 8
    id = 17;
    author = 2;
    client.hmset('drawing:' + id, [
        'title', 'Love',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 9
    id = 18;
    author = 3;
    client.hmset('drawing:' + id, [
        'title', 'Batman',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 10
    id = 19;
    author = 1;
    client.hmset('drawing:' + id, [
        'title', 'PunisheR',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 11
    id = 20;
    author = 2;
    client.hmset('drawing:' + id, [
        'title', 'Spider',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 12
    id = 25;
    author = 3;
    client.hmset('drawing:' + id, [
        'title', 'Hulk',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 13
    id = 31;
    author = 1;
    client.hmset('drawing:' + id, [
        'title', 'Kill Bill',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 14
    id = 36;
    author = 2;
    client.hmset('drawing:' + id, [
        'title', 'Cold Winter',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 15
    id = 38;
    author = 3;
    client.hmset('drawing:' + id, [
        'title', 'Portrait',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 16
    id = 39;
    author = 1;
    client.hmset('drawing:' + id, [
        'title', 'Moon',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Drawing 17
    id = 40;
    author = 2;
    client.hmset('drawing:' + id, [
        'title', 'Dragon',
        'author', author,
        'path', 'images/drawings/' + id + '.png',
        'likes', 0
    ]);
    client.lpush('wall', id);
    client.lpush('author:' + author, id);
    // Set drawID
    client.set('drawid', 41);

    console.log('Database updated');
});

client.on('error', function (err) {
    console.log('Error ' + err)
})
