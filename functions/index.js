const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Export modules (to be implemented)
// exports.lichess = require('./lichess');
exports.payments = require('./payments');
exports.notifications = require('./notifications');
