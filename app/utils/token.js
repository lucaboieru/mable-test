var crypto = require('crypto');
var redisClient = require('redis').createClient();

redisClient.on('error', function (err) {
    console.error(err);
});

var TOKEN_LENGTH = 32;

exports.create = function(callback) {
    crypto.randomBytes(TOKEN_LENGTH, function(ex, token) {
        if (ex) callback(ex);

        if (token) callback(null, token.toString('hex'));
        else callback(new Error('Problem when generating token'));
    });
};

exports.setTokenWithData = function(token, data, ttl, callback) {
    if (token == null) throw new Error('Token is null');
    if (data != null && typeof data !== 'object') throw new Error('data is not an Object');

    var userData = data || {};
    userData._ts = new Date();

    var timeToLive = ttl || auth.TIME_TO_LIVE;
    if (timeToLive != null && typeof timeToLive !== 'number') throw new Error('TimeToLive is not a Number');

    redisClient.set(token, JSON.stringify(userData), function(err, reply) {
        if (err) callback(err);

        if (reply) {
            redisClient.expire(token, timeToLive, function(err, reply) {
                if (err) callback(err);

                if (reply) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Expiration not set on redis'));
                }
            });
        }
        else {
            callback(new Error('Token not set in redis'));
        }
    });
};

exports.getDataByToken = function(token, callback) {
    if (token == null) callback(new Error('Token is null'));

    redisClient.get(token, function(err, userData) {
        if (err) callback(err);

        if (userData != null) callback(null, JSON.parse(userData));
        else callback(new Error('Token Not Found'));
    });
};

exports.expire = function (token, callback) {
    if (token == null) callback(new Error('Token is null'));

    redisClient.expire(token, 0, function(err, reply) {
        if (err) callback(err);

        if (reply) callback(null, true);
        else callback(new Error('Expiration not set on redis'));
    });
};
