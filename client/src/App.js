import React, { useState, useEffect } from 'react';
import { TextField, Grid, Fab, Typography, Paper, MenuItem } from '@material-ui/core'
import Axios from 'axios'

import SearchBar from './components/SearchBar'
import Fridge from './components/Fridge'
import AppLayout from './components/AppLayout'
import RecipeList from './components/RecipeList'

function App() {
	const fridgeState = {
		NotInit: 1,
		Init: 2,
		InitFailed: 3
	}


	let [isFridgeInit, setIsFridgeInit] = useState(fridgeState.NotInit)
	let [fridgeName, setFridgeName] = useState("")
	let [selectedIngredientName, setSelectedIngredientName] = useState("")
	let [selectedIngredient, setSelectedIngredient] = useState({})
	let [quantity, setQuantity] = useState(1)
	let [unit, setUnit] = useState('g')
	let [recipes, setRecipes] = useState([])


	useEffect(() => {
		Axios.post('http://localhost:5000/cookie-api/ingredients/add?name=' + 
					selectedIngredientName + '&quantity=' + quantity + 
					'&fridgeName=' + fridgeName)
		.then(response => {
			if (response.data.succeed === true) {
				setSelectedIngredient({
					name: selectedIngredientName,
					quantity: quantity,
					unit: unit
				})
			} else
				console.log(response.data.message)
		})
		.catch(err => console.error(err.stack))
	}, [selectedIngredientName])


	const createNewFridge = fridgeName => {
		Axios.post('http://localhost:5000/cookie-api/fridges/add/' + fridgeName)
		.then(response => {
			if (response.data.succeed === false)
				return setIsFridgeInit(fridgeState.InitFailed)
			return setIsFridgeInit(fridgeState.Init)
		})
		.catch(err => {
			console.error(err.stack)
			return setIsFridgeInit(fridgeState.InitFailed)
		})
	}

	const getRecipes = fridgeName => {
		Axios.get('http://localhost:5000/cookie-api/fridges/get-recipes-from-fridge-name/' + fridgeName)
		.then(response => setRecipes(response.data))
		.catch(err => console.error(err.stack))
	}


	return isFridgeInit === fridgeState.Init ? (
		<AppLayout>
			<Grid item xs={6}>
				<Typography variant="h3">
					Well done!
				</Typography>
				<Typography variant="h6">
					Now add ingredients from your kitchen to {fridgeName}!
				</Typography>
			</Grid>
			<Grid xs={8} item container spacing={2}>
				<Grid item xs={10}> 
					<SearchBar 
						fetchSuggestions={inputText => new Promise((resolve, reject) => {
							Axios.get('http://localhost:5000/cookie-api/ingredients/list/' + inputText)
							.then(response => resolve(response.data))
							.catch(err => reject(err.stack))
						})} 
						mountSelectedSuggestion={selected => setSelectedIngredientName(selected)}
						maxSuggestions={15}
					/>
				</Grid>
				<Grid item xs={1}>
					<TextField
						type="number"
						variant="outlined"
						defaultValue={1}
						onChange={(e) => setQuantity(e.target.value)}
					/>
				</Grid>
				<Grid item xs={1}>
					<TextField
						variant="outlined"
						select
						value='g'
						onChange={(e) => setUnit(e.target.value)}
					>
						{['g', 'mg', 'cl', 'ml'].map((unit, id) => (
							<MenuItem key={id} value={unit}>
								{unit}
							</MenuItem>
						))}
					</TextField>
				</Grid>
			</Grid>
			<Grid item xs={8}>
				<Fridge name={fridgeName} newIngredient={selectedIngredient} />
			</Grid>
			<Grid 
				container item xs={6}
				justify="center"
				alignItems="center"
			>
				<Grid item xs={4} >
					<Fab
						variant="extended" 
						color="primary"
						onClick={() => getRecipes(fridgeName)}
					>
						Find me some recipes !
					</Fab>
				</Grid>
			</Grid>
			{recipes.length > 0 && (
				<Grid item xs={8}>
					<Typography variant="h5">
						All found recipes:
					</Typography>
				</Grid>
			)}
			{recipes.length > 0 && (
				<Grid item xs={8}>
					<RecipeList recipes={recipes}/>
				</Grid>
			)}
		</AppLayout>
	) : (
		<AppLayout>
			<Grid item xs={7}>
				<Typography variant="h3">
					Cooking has never been so easy.
				</Typography>
				<Typography variant="h6">
					Find all recipes you can cook with ingredients in your kitchen.
				</Typography>
			</Grid>
			<Grid item xs={8} >
				<TextField
					label="Your fridge"
					placeholder="Let's create your fridge first"
					variant="outlined"
					fullWidth
					autoFocus
					onChange={e => setFridgeName(e.target.value)}
				/>
				{isFridgeInit === fridgeState.InitFailed && (
					<Typography variant="h6" color="error">
						Failed to create your fridge :(
					</Typography>
				)}
			</Grid>
			<Grid 
				container item xs={6}
				justify="center"
				alignItems="center"
			>
				<Grid item xs={4} >
					<Fab
						variant="extended" 
						color="primary"
						onClick={() => createNewFridge(fridgeName)}
					>
						Create my Fridge !
					</Fab>
				</Grid>
			</Grid>
		</AppLayout>
	)
}

export default App;
