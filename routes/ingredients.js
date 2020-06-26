const express = require('express')
const router = express.Router()
const axios = require('axios')

const getFridgeFromName = require('./functions/getFridgeFromName')
const Ingredient = require('../models/Ingredient')
const Fridge = require('../models/Fridge')

const {apiURL, apiKey} = require('./externAPIConfig')


router.get('/get-from-name/:name', (req, res) => {
    Ingredient.find({
        name: req.params.name.toLowerCase()
    })
    .then(response => res.json(response.map(ingredient => ({
            name: ingredient.name,
            quantity: ingredient.quantity,
    }))))
    .catch(err => res.status(404).json({message: err.stack, succeed: false}))
})

router.get('/list/:name', (req, res) => {
    axios.get(apiURL + '/food/ingredients/autocomplete?query=' +
        req.params.name + '&apiKey=' +
        apiKey)
    .then(response => {
        response = response.data
        res.json(response.map(r => r.name))
    })
    .catch(err => res.status(404).json({message: err.stack, succeed: false}))
})

router.post('/add', (req, res) => {
    let { name, quantity, fridgeName } = req.query

    getFridgeFromName(fridgeName, (response) => {
        Ingredient
        .find({ name: name })
        .then(response2 => {
            if (response2.length != 0) {
                Ingredient
                .findOneAndUpdate({ 
                    name: name 
                }, {
                    $inc: { quantity: quantity }
                }, (err, _) => {
                    if (err)
                        res.status(404).json({message: err.stack, succeed: false})
                    res.json({message: "Document updated.", succeed: true})
                })
            } else {
                new Ingredient({
                    name: name.toLowerCase(),
                    quantity: quantity,
                    fridgeId: response._id
                })
                .save((err, ingredient) => {
                    if (err)
                        res.status(404).json({message: err.stack, succeed: false})
                    Fridge.findByIdAndUpdate(response._id, {
                        $push: { ingredients: ingredient._id }
                    }, (err, _) => {
                        if (err)
                            res.status(404).json({message: err.stack, succeed: false})
                        res.json({message: "Document added to database.", succeed: true})
                    })
                })
            }
        })
        .catch(err => res.status(404).json({message: err.stack, succeed: false}))
    }, err => res.status(404).json({message: err.stack, succeed: false}))
})

router.delete('/delete/:name', (req, res) => {
    Ingredient.findOneAndDelete({
        name: req.params.name
    }, (err, response) => {
        if (err)
            res.status(404).json({message: err.stack, succeed: false})
        if (response == null)
            res.json({message: "No matching document.", succeed: false})
        else {
            Fridge.findByIdAndUpdate(response.fridgeId, {
                $pull: { ingredients: response._id }
            }, (err, _) => {
                if (err)
                    res.status(404).json({message: err.stack, succeed: false})
                res.json({message: "Document deleted.", succeed: true})
            })
        }
    })
})

module.exports = router