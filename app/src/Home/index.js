import React, {useState, useEffect} from 'react'
import Card from '../components/Card'
import BasicTable from '../components/BasicTable'

import { Grid } from '@mui/material'

import './styles.scss'

export default function Home() {

    const [state, setState] = useState({balances: null})

    
    useEffect( () => {

        get('/balances')
        .then( bal => setState( {balances: bal}) )
        
    }, [])

    return (
        <div className='main wrapper'>

            <Grid container spacing={2}>
                <Grid item xs={6} >
                    <Card title="Balance">
                        <BasicTable fields={["Coin", "Amount","Price", "Value (USD)", "Value (BTC)"]} data = {state.balances}/>
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