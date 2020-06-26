const express = require('express')
const axios = require('axios')
const router = express.Router()
const ObjectId = require('mongoose').Types.ObjectId

const Fridge = require('../models/Fridge')
const Ingredient = require('../models/Ingredient')

const getFridgeFromName = require('./functions/getFridgeFromName')
const getFridgeIngredients = require('./functions/getFridgeIngredients')
const isSucceedResponse = require('./functions/isSucceedResponse')

const {apiURL, apiKey} = require('./externAPIConfig')

const mapIngredientList = ingredientsAPI => ingredientsAPI.map(ingredient => ({
    name: ingredient.name,
    quantity: ingredient.amount,
    unit: ingredient.unit,
    image: ingredient.image
}))

const getRecipes = (fridgeId, callback, errorHandler) => {
    getFridgeIngredients(fridgeId, response => {
        let ingredientsQueryParam = response.map((r, i) => 
            r.name + ((i != response.length - 1) ? ',+' : '')).join('')

        if (!isSucceedResponse(response))
            return callback(response)
        axios
        .get(apiURL + '/recipes/findByIngredients?ingredients=' + 
            ingredientsQueryParam + '&apiKey=' + apiKey)
        .then(response => {
            response = response.data
            callback(response.map(recipe => ({
                title: recipe.title,
                image: recipe.image,
                missedIngredients: mapIngredientList(recipe.missedIngredients),
                usedIngredients: mapIngredientList(recipe.usedIngredients),
            })))
        })
        .catch(err => errorHandler(err))
    }, err => errorHandler(err))
}

router.get('/list-all', (req, res) => {
    Fridge.find({})
    .then(response => {
        res.json(response.map(r => ({
            name: r.name,
            ingredients: r.ingredients.length
        })))
    })
    .catch(err => res.status(404).json({message: err.stack, succeed: false}))
})

router.get('/get-ingredients-by-fridge/:fridge_id', (req, res) => {
    getFridgeIngredients(req.params.fridge_id, 
        response => res.json(response),
        err => res.status(404).json({message: err.stack, succeed: false})
    )
})

router.get('/get-ingredients-by-fridge-name/:fridge_name', (req, res) => {
    getFridgeFromName(req.params.fridge_name, 
        response => {
            if (!isSucceedResponse(response))
                return res.json(response)
            getFridgeIngredients(response._id, 
                response => res.json(response),
                err => res.status(404).json({message: err.stack, succeed: false})
            )
        }, 
        err => res.status(404).json({message: err.stack, succeed: false})
    )
})

router.get('/get-recipes-from-fridge/:fridge_id', (req, res) => {
    getRecipes(req.params.fridge_id, 
        response => res.json(response),
        err => res.status(404).json({message: err.stack, succeed: false})
    )
})

router.get('/get-recipes-from-fridge-name/:fridge_name', (req, res) => {
    getFridgeFromName(req.params.fridge_name, response => {
        if (!isSucceedResponse(response))
            return res.json(response)
        getRecipes(response._id, 
            response => res.json(response),
            err => res.status(404).json({message: err.stack, succeed: false})
        )
    },
    err => res.status(404).json({message: err.stack, succeed: false})
    )
})

router.post('/add/:fridge_name', (req, res) => {
    new Fridge({
        name: req.params.fridge_name,
        ingredients: []
    })
    .save((err, _) => {
        if (err)
            res.status(404).json({message: err.stack, succeed: false})
        res.json({message: 'Document added to collection.', succeed: true})
    })
})

router.post('/edit/:fridge_id', (req, res) => {
    if (!ObjectId.isValid(req.params.fridge_id))
        return res.json({message: 'Not a valid id', succeed: false})
    Fridge.findByIdAndUpdate(req.params.fridge_id, 
    {
        name: req.query.name
    }, (err, document) => {
        if (err)
            res.status(404).json({message: err.stack, succeed: false})
        if (document == null)
            res.json({message: 'No matching document.', succeed: false})
        else
            res.json({message: 'Document updated.', succeed: true})
    })
})

router.post('/edit-by-name/:fridge_name', (req, res) => {
    Fridge.findOneAndUpdate({
        name: req.params.fridge_name
    }, {
        name: req.query.name
    }, (err, document) => {
        if (err)
            res.status(404).json({message: err.stack, succeed: false})
        if (document == null)
            res.json({message: 'No matching document.', succeed: false})
        else
            res.json({message: 'Document updated.', succeed: true})
    })
})

const deleteFridgeIngredients = (fridgeId, callback, errorHandler) => {
    if (!ObjectId.isValid(fridgeId))
        return callback({message: 'Not a valid id.', succeed: false})
    Ingredient.deleteMany({
        fridgeId: fridgeId
    }, (err, document) => {
        if (err)
            errorHandler(err)
        if (document == null)
            return callback({message: 'No matching document.', succeed: false})
        callback({message: 'Document deleted.', succeed: true})
    })
}

router.delete('/delete/:fridge_id', (req, res) => {
    if (!ObjectId.isValid(req.params.fridge_id))
        res.json({message: 'Not a valid id', succeed: false})
    else {
        Fridge.findByIdAndDelete(req.params.fridge_id, 
        (err, _) => {
            if (err)
                res.status(404).json({message: err.stack, succeed: false})
            deleteFridgeIngredients(req.params.fridge_id,
                document => res.json(document),
                err => res.status(404).json({message: err.stack, succeed: false})
            )
        })
    }
})

router.delete('/delete-by-name/:fridge_name', (req, res) => {
    Fridge.findOneAndDelete({
        name: req.params.fridge_name
    }, (err, response) => {
        if (err)
            res.status(404).json({message: err.stack, succeed: false})
        deleteFridgeIngredients(response, 
            document => res.json(document),
            err => res.status(404).json({message: err.stack, succeed: false})
        )
    })
})

module.exports = router