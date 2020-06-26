import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		overflow: 'hidden',
		backgroundColor: theme.palette.background.paper,
	},
	gridList: {
		width: "auto",
		height: 450,
	},
	icon: {
		color: 'rgba(255, 255, 255, 0.54)',
	},
}));

export default function RecipeList(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<GridList cellHeight={180} className={classes.gridList}>
				{props.recipes.map((recipe, id) => (
					<GridListTile key={id}>
						<img src={recipe.image} alt={recipe.title} />
						<GridListTileBar
							title={recipe.title}
							subtitle={<span>Missing ingredients: {recipe.missedIngredients.map((ing, i) => 
								ing.name + (i == recipe.missedIngredients.length - 1 ? '' : ',')).join('')}</span>}
							actionIcon={
								<IconButton aria-label={`info about ${recipe.title}`} className={classes.icon}>
									<InfoIcon />
								</IconButton>
							}
						/>
					</GridListTile>
				))}
			</GridList>
		</div>
	);
}