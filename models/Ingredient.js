
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collections = require('../config/mongo').collections

const IngredientSchema = new Schema (
    {
        name: {
            type: String
        },
        quantity: {
            type: Number
        },
        fridgeId: {
            type: Schema.Types.ObjectId
        }
    },
    { 
        collection: collections.ingredients,
        versionKey: false
    }
)

module.exports = mongoose.model(collections.ingredients, IngredientSchema)