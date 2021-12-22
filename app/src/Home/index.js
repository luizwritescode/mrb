import React, {useState} from 'react'
import Card from '../components/Card'
import BasicTable from '../components/BasicTable'

import { Grid } from '@mui/material'

import './styles.scss'

export default function Home() {

    const [state, setState] = useState({balances: false})

    get('/balances')
        .then( bal => setState( {...state, balances: bal}) )

    return (
        <div className='main wrapper'>

            <Grid container spacing={2}>
                <Grid item xs={6} >
                    <Card title="Balance">
                        <BasicTable/>
                    </Card>
                </Grid>

                <Grid item xs={6}>
                    <Card title="Positions">
                        
                    </Card>
                </Grid>

            </Grid>
           
           

        </div>
    )
}

const get = async (endpoint) => {
    const response = await fetch(endpoint)
    const body = await response.json()
    return body
}