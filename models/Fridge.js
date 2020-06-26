const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collections = require('../config/mongo').collections

const FridgeSchema = new Schema(
    {
        name: {
            type: String
        },
        ingredients: {
            type: [Schema.Types.ObjectId]
        }
    },
    {
        collection: collections.fridges,
        versionKey: false
    }
)

module.exports = mongoose.model(collections.fridges, FridgeSchema)