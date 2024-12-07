const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({ 

    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;