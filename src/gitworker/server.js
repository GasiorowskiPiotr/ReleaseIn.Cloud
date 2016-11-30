"use strict";
var storage = require('azure-storage');
var config_1 = require('./config');
var handlers = require('./logic/');
var getMessageOptions = {
    numOfMessages: 1,
    timeoutIntervalInMs: 120000,
    useNagleAlgorithm: false
};
var queueClient = storage.createQueueService(config_1.storageConnectionString);
queueClient.createQueueIfNotExists("gitworker-validaterepo", {
    useNagleAlgorithm: false
}, function (err, results) {
    if (err) {
        console.log(err);
        return;
    }
    setInterval(function () {
        queueClient.getMessages("gitworker-validaterepo", getMessageOptions, function (err, messages) {
            if (err) {
                console.log(err);
                return;
            }
            messages.forEach(function (msg) {
                var message = JSON.parse(msg.messageText);
                handlers.validateHandler(message.GitUrl, function (err, resp) {
                    if (err) {
                        queueClient.createMessage(message.RespondTo, JSON.stringify({ isOk: false }));
                    }
                    else {
                        if (resp.isOk) {
                            queueClient.createMessage(message.RespondTo, JSON.stringify({
                                isOk: true,
                                branches: resp.branches
                            }));
                        }
                    }
                });
            });
        });
    }, 100);
});
//# sourceMappingURL=server.js.map