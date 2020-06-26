import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Fab } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import Axios from 'axios'

export default class Fridge extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            name: "",
            ingredients: []
        }
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.newIngredient !== this.props.newIngredient) {
            this.setState(state => ({
                ingredients: [
                    ...state.ingredients,
                    this.props.newIngredient
                ]
            }))
        }
    }

    removeIngredient(name)
    {
        Axios.delete('http://localhost:5000/cookie-api/ingredients/delete/' + name)
        .then(response => {
            if (response.data.succeed === false)
                return console.log(response.data.message)
        })
        .catch(err => console.error(err.stack))
    }

    render()
    {
        return this.state.ingredients.length > 0 && (
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ingredients</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="center">Unit</TableCell>
                            <TableCell align="right">Delete item</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.ingredients.map((ingredient, id) => (
                            <TableRow key={id}>
                                <TableCell component="th" scope="row">
                                    {ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)}
                                </TableCell>
                                <TableCell align="center">{ingredient.quantity}</TableCell>
                                <TableCell align="center">{ingredient.unit}</TableCell>
                                <TableCell align="right">
                                    <Fab size="small" onClick={() => {
                                        this.setState(state => ({
                                            ingredients: state.ingredients.filter((_, i) => i !== id)
                                        }))
                                        this.removeIngredient(ingredient.name)
                                    }}>
                                        <CancelIcon/>
                                    </Fab>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

Fridge.propTypes = {
    newIngredient: PropTypes.shape({
        name: PropTypes.string,
        quantity: PropTypes.number
    })
}