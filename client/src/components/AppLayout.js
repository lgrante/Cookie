import React, { Component } from 'react'
import { Grid, Paper } from '@material-ui/core'

export default function AppLayout(props) {
    return (
		<Paper
			elevation={12}
			style={{
				height: "auto",
				padding: 20,
				backgroundColor: "#f0f5fc"
			}}
		>
			<Grid
				container
				justify="center"
				spacing={8}
				style={{
                    paddingTop: 40,
                    paddingBottom: 40
				}}
			>
                {props.children}
			</Grid>
		</Paper>
    )
}