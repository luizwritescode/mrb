import React from 'react'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import "./styles.scss"

export default function Card(props) {
    return (
        <Box
            sx={{
                display:'flex',
                flexWrap: 'wrap',
                minWidth: '100%'         
            }}
        >

            <Paper sx={{
                minWidth: '100%'         
            }} elevation={1}  >
                <div className="title">
                    {props.title}
                </div>

                {props.children}
            </Paper>

        </Box>
    )
}