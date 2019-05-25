const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const crypto = require('crypto');
const multer  = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const bluebird = require("bluebird");
const history = require('connect-history-api-fallback');

const app = express();
const port = 3000;
const client = redis.createClient();

// Async redis (enables .then)
bluebird.promisifyAll(redis.RedisClient.prototype);

// where to store uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + '.png');
    }
});

const upload = multer({ storage: storage });

// history mode
app.use(history());

// support parsing of application/json type post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Redis
client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Error ' + err)
})

// Hash user password
function hashPass(pass) {
    return pass;
}

// Unprotected routes

// Public VUE files (front-end)
// app.use(express.static('public'));

// Prints request url
app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// Add CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

// test route
app.get('/test', (req, res) => {
    console.log('stigo');
    res.send('test');
});

// Create User (SIGN UP)
app.post('/users', (req, res) => {

    console.log(req.body);

    // Check for inputs and trim spaces
    var username = (req.body['username'] == null) ? "" : req.body['username'].trim();
    var email = (req.body['email'] == null) ? "" : req.body['email'].trim();
    var password = (req.body['password'] == null) ? "" : req.body['password'].trim();
    var fname = (req.body['fname'] == null) ? "" : req.body['fname'].trim();
    var lname = (req.body['lname'] == null) ? "" : req.body['lname'].trim();
    var date = (req.body['date'] == null) ? "" : req.body['date'].trim();

    // Hash password and add token
    password = hashPass(password);
    var token = crypto.randomBytes(20).toString('hex');

    // Bad input
    if (username == "" || email == "" || password == "" || fname == "" || lname == "" || date == "") {
        res.status(400).send('Form not valid');
        return;
    }

    // Valid input
    // Check if email is unique
    client.hget('emails', email, function (err, em) {
        if (err || em) {
            res.status(400).send('Email already exits');
            return;
        }
        // Find ID
        client.incr('id', function(err, id) {
            // Save user to users list
            client.lpush('users', id);
            // Save user with ID
            client.hmset('user:' + id, ['username', username,
                                        'email', email,
                                        'password', password,
                                        'fname', fname,
                                        'lname', lname,
                                        'date', date,
                                        'token', token
                                    ], function (err, params) {
                // Save email with id
                client.hset('emails', email, id, function (err, params) {
                    // Succes
                    res.status(201).send("" + id);
                });
            });
        });
    });
});

// Authenticate User (LOGIN)
app.post('/auth', (req, res) => {
    console.log('AUTH');

    // Check for inputs and trim spaces
    var email = (req.body['email'] == null) ? "" : req.body['email'].trim();
    var password = (req.body['password'] == null) ? "" : req.body['password'].trim();

    console.log(email, password);

    // Bad input
    if (email == "" || password == "") {
        res.status(400).send('Form not valid');
        return;
    }

    // Valid input
    // Find ID with email
    client.hget('emails', email, function (err, id) {
        if (err || id == null) {
            res.status(400).send('Wrong email or password');
            return;
        }
        console.log('' + id);

        // Check if passwords are the same
        client.hmget('user:' + id, 'password', 'token', function(err, fields) {
            if (err || hashPass(password) != fields[0]) {
                res.status(400).send('Wrong email or password');
                return;
            }
            // Save token to auths hash and return to user
            console.log(fields);
            var token = fields[1];
            client.hmset('auths', token, id);
            // Succes
            res.status(200).send({'token': token, 'id': id});
        });
    });
});

// Add token if exists middleware
app.use((req, res, next) => {
    var auth = req.headers.authorization;
    var token = "";
    if (auth != null) {
        token = auth.split(' ')[1];
        req.body['token'] = token;
    }
    console.log('Token Protect: ' + token);
    next();
});

// Remove active User (LOG OUT)
app.get('/logout', (req, res) => {
    console.log('logout');
    var oldtoken = req.body['token'];
    if (oldtoken == null) {
        res.status(200).send('How even?');
    } else {
        console.log('remove');
        client.hget('auths', oldtoken, function (err, id) {
            if (err || id == null) {
                // Not logged in
                res.status(200).send('Not logged in');
                return;            
            }
            // Found user, change token and remove auth
            var token = crypto.randomBytes(20).toString('hex');
            client.hset('user:' + id, 'token', token);
            client.hdel('auths', oldtoken, redis.print);
            res.status(200).send('Logged out');        
        });
    }
});


// Protected routes
var userID = -1;

// Block invalid token middleware
app.use((req, res, next) => {
    var token = req.body['token'];
    if (token == null) {
        res.status(401).send('No token provided');
        return;
    }
    client.hget('auths', token, function (err, id) {
        if (err || id == null) {
            res.status(401).send('Not logged in');
            return;
        }
        client.hget('user:' + id, 'token', function (err, realToken) {
            if (err || token != realToken) {
                res.status(401).send('Invalid token');
                return;
            }
            // Token valid, add ID to request
            userID = id;
            next();
        })
    });
});

// Token Checker
app.post('/validate', (req, res) => {
    // if user can access, then the token is valid
    res.status(200).send({id : userID});
});

// Load all images
app.use('/images', express.static(__dirname + '/images'));

// Get User by ID
app.get('/user/:id', (req, res) => {
    let id = req.params.id;

    client.hgetall('user:' + id, function (err, result) {
        if (err || result == null) {
            res.status(404).send('User not found');
            return;
        }
        delete result['password'];
        delete result['token'];
        res.send(result);
    })
});

// Save Avatar
app.post('/avatar', upload.single('avatar'), (req, res) => {
    let ext = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'), req.file.originalname.length);
    let name = 'av' + userID + '.png';
    // resize to 300px and move to avatars folder
    let full = 'images/avatars/' + name;
    sharp(req.file.path)
    .resize(300, 300, {
        fit: 'cover'
    })
    .toFile(full, (err, info) => {
        if (err) {
            res.sendStatus(500);
        }
        // save avatar to redis in user hash
        client.hmset('user:' + userID, ['avatar', full], function (err, params) {
            res.status(200).send(full);
        });
    });
    // resize to 40px and move to heads folder
    sharp(req.file.path)
    .resize(40, 40, {
        fit: 'cover'
    })
    .toFile('images/heads/' + name, (err, info) => {});
});

// Save Drawing
app.post('/drawing', upload.single('drawing'), (req, res) => {
    console.log(req.file);
    console.log(req.body);
    // get ID of drawing
    client.incr('drawid', function(err, id) {
        // move to drawings folder
        let path = 'images/drawings/' + id + '.png';
        console.log(path);
        fs.rename(req.file.path, __dirname + '/' + path, (err) => {});
        // Save to Redis
        client.hmset('drawing:' + id, [
                                        'title', req.body['title'],
                                        'author', userID,
                                        'path', path,
                                        'likes', 0
                                ], function (err, params) {
            // Add ID of drawing to wall
            client.lpush('wall', id);
            // Add ID of drawing to author's art
            client.lpush('author:' + userID, id);
            // Return path to image
            res.status(200).send(path);
        });
    });
});

// Delete Drawing by ID
app.delete('/drawing/:id', (req, res) => {
    let id = req.params.id;
    // find drawing
    client.hgetall('drawing:' + id, function (err, result) {
        if (err || result == null || (userID != result['author'])) {
            res.status(404).send('Drawing not found');
            return;
        }
        // delete drawing and it's ID from wall and author
        client.del('drawing:' + id);
        client.lrem('wall', 0, id);
        client.lrem('author:' + userID, 0, id);
        // get all users
        client.lrangeAsync('users', 0, -1)
        // delete drawing from all loves, hates, likes
        .then(value => {
            for (let i = 0; i < value.length; i++) {
                const user = value[i];
                client.srem('loves:' + user, id);
                client.srem('likes:' + user, id);
                client.srem('hates:' + user, id);
            }
            // send response to client
            console.log(value);
            console.log('deleting ' + id);
            res.status(200).send('deleted');
        });
    });
});

// Get all drawings
app.get('/drawings', (req, res) => {
    client.lrange('wall', 0, -1, function (err, list) {
        console.log(list);
        res.status(200).send(list);
    })
});

// Get drawings by User ID
app.get('/author/:id', (req, res) => {
    let id = req.params.id;
    // find all by user
    client.lrange('author:' + id, 0, -1, function (err, list) {
        console.log(list);
        res.status(200).send(list);
    })
});

// Get Drawing by ID
app.get('/drawing/:id', (req, res) => {
    let id = req.params.id;
    // find all drawing info
    client.hgetall('drawing:' + id, function (err, result) {
        if (err || result == null) {
            res.status(404).send('Drawing not found');
            return;
        }
        // find loves, hates, likes
        client.sismemberAsync('loves:' + userID, id)
        .then(value => {
            result['love'] = value;
            return client.sismemberAsync('likes:' + userID, id);
        }).then(value => {
            result['like'] = value;
            return client.sismemberAsync('hates:' + userID, id);
        }).then(value => {
            result['hate'] = value;
            res.status(200).send(result);
        });

    });
});

// Add drawing to favourites
app.post('/loves/:id', (req, res) => {
    let id = req.params.id;
    console.log(userID + ' loves ' + id);
    // add to set if not added, or remove if exists
    client.sismember('loves:' + userID, id, function (err, contains) {
        if (contains) {
            client.srem('loves:' + userID, id);
            res.status(200).send('' + id);
        } else {
            client.sadd('loves:' + userID, id);
            res.status(200).send('' + id);
        }
    });
});

// Get all favourite drawings
app.get('/loves/:id', (req, res) => {
    let id = req.params.id;
    // get all
    client.smembers('loves:' + userID, function (err, list) {
        console.log(list);
        res.status(200).send(list);
    })
});

// Like drawing
app.post('/likes/:id', (req, res) => {
    let id = req.params.id;
    console.log(userID + ' likes ' + id);
    // add to likes
    client.sadd('likes:' + userID, id);
    // remove from hates
    client.srem('hates:' + userID, id);
    res.status(200).send('' + id);
});

// Hate drawing
app.post('/hates/:id', (req, res) => {
    let id = req.params.id;
    console.log(userID + ' hates ' + id);
    // add to hates
    client.sadd('hates:' + userID, id);
    // remove from likes
    client.srem('likes:' + userID, id);
    res.status(200).send('' + id);
});


// Listen
app.listen(port, () => console.log(`Example app listening on port ${port}!`))