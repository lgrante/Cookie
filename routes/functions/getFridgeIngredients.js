const Ingredient = require('../../models/Ingredient')

module.exports = getFridgeIngredients = (id, callback, errorHandler) => {
    if (!(require('mongoose').Types.ObjectId.isValid(id)))
        return callback({message: 'Not a valid id', succeed: false})
    Ingredient.find({
        fridgeId: id
    })
    .then(response => {
        if (response == null || response.length == 0)
            return callback({message: 'No matching document.', succeed: false})
        callback(response)
    })
    .catch(err => errorHandler(err))
}