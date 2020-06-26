import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField, MenuList, MenuItem, Grid, Paper, Typography } from '@material-ui/core'

export default class SearchBar extends Component
{
    constructor(props)
    {
        super(props)
        this.state = ({
            text: '',
            suggestions: [],
            currentSuggestion: 0
        })
    }

    doSearch(searchString)
    {
        this.setState(() => ({
            suggestions: []
        }))
        this.props.mountSelectedSuggestion(searchString)
    }

    handleTextInput(text)
    {
        this.setState(state => ({
            text: text,
            ...state
        }))
    }

    handleKey(key)
    {
        let current = this.state.currentSuggestion

        if (key === 9 || key === 40 || key === 38) {
            let total = this.state.suggestions.length
            let sug = (key === 40 || key === 9) ? (current + 1) : (current - 1)
            let newSuggestion = (sug >= total) ? 0 : ((sug < 0) ? (total - 1) : sug)

            this.setState(() => ({
                currentSuggestion: newSuggestion
            }))
        } else if (key === 13) {
            this.setState(state => ({
                text: state.suggestions[current]
            }))
            this.doSearch(this.state.suggestions[current])
        }
    }

    handleChange(value)
    {
        this.setState(() => ({
            text: value,
        }))
        if (value.length !== 0) {
            this.props.fetchSuggestions(value)
            .then(response => this.setState(() => ({
                suggestions: response
            })))
            .catch(err => console.error(err))
        } else
            this.setState({suggestions: []})
    }

    render()
    {
        const { text, suggestions, currentSuggestion } = this.state

        return (
            <div className='wrapper'>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            label="Ingredients search bar"
                            placeholder="Search your favorite ingredients..."
                            variant="outlined"
                            fullWidth
                            onInput={e => this.handleTextInput(e.target.value)}
                            onKeyDown={e => this.handleKey(e.keyCode)}
                            onChange={e => this.handleChange(e.target.value)}
                            autoFocus
                            value={text}
                        />
                    </Grid>
                    {suggestions !== null && suggestions.length !== 0 && (
                        <Grid item xs={12}>
                            <Paper>
                                <MenuList>
                                    {suggestions.filter((_, id) => id < this.props.maxSuggestions).map((suggestion, id) => (
                                        <MenuItem 
                                            selected={id === currentSuggestion}
                                            onClick={() => this.doSearch(suggestions[id])}
                                            key={id}
                                        >
                                            <Typography variant="body1">{suggestion}</Typography>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </div>
        )
    }
}

SearchBar.propTypes = {
    maxSuggestions: PropTypes.number,
    fetchSuggestions: PropTypes.func,
    mountSelectedSuggestion: PropTypes.func
}

SearchBar.defaultProps = {
    maxSuggestions: 6
}