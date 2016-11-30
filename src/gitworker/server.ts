import * as storage from 'azure-storage';
import { storageConnectionString, instanceName } from './config';
import * as handlers from './logic/';

const getMessageOptions : storage.QueueService.GetMessagesRequestOptions = {
    numOfMessages: 1,
    timeoutIntervalInMs: 120000,
    useNagleAlgorithm: false,

};
const queueClient = storage.createQueueService(storageConnectionString).withFilter(new azure.ExponentialRetryPolicyFilter();
;

queueClient.createQueueIfNotExists(`gitworker-validaterepo`,{
    useNagleAlgorithm: false
}, (err, results) => {
    if(err) {
        console.log(err);
        return;
    }

    setInterval(() => {
        queueClient.getMessages(`gitworker-validaterepo`, getMessageOptions, (err, messages) => {
        if(err) {
            console.log(err);
            return;
        }

        messages.forEach(msg => {

            try {

            } catch(e) {
                if(msg.dequeueCount > 3) {
                    
                }
            } 
            var message = JSON.parse(msg.messageText);
            handlers.validateHandler(message.GitUrl, (err, resp) => {
                if(err) {
                    queueClient.createMessage(message.RespondTo, JSON.stringify({ isOk: false }))
                } else {
                    if(resp.isOk) {
                        queueClient.createMessage(message.RespondTo, JSON.stringify({
                            isOk: true,
                            branches: resp.branches
                        }));
                    }
                }
            });


        })
    });
    }, 100);    
});