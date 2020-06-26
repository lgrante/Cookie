const Fridge = require('../../models/Fridge')

module.exports = getFridgeFromName = (name, callback, errorHandler) => {
    Fridge.findOne({
        name: name
    })
    .then(response => {
        if (response == null || response.length == 0)
            return callback({message: 'No matching document.', succeed: false})
        callback(response)
    })
    .catch(err => errorHandler(err))
}