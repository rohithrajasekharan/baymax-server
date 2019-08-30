const mongoose = require('mongoose');

module.exports = {
    notify: function (title, description, url, image,callback) {
        var error;
        if (title == null || description == null) {
            let newNotification = new Notif({
                userId: req.userId,
                title: title,
                description: description,
                url: url,
                seen: false,
                date: Date.now(),
                image: image
            })

            newNotification.save().then(() => {
                callback(error)
            }).catch(() => {
                error="unable to notify"
                callback(error)
            })
        }
    }
}


