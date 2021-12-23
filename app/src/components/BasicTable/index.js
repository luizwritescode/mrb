import React, {useEffect, useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [ {
    name: 'BTC',
    amount: 1,
    value: 5
} ]


export default function BasicTable(props) {

  const [tickers, setTickers] = useState(false)
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([])

  console.log(props.data)
  useEffect( () => {
    fetchData()
  }, [rows])

  const fetchData = () => {
    setLoading(true)

      fetch('/tickers')
      .then( t => {
        setTickers(t)
        setLoading(false)
      }
    )
    
  }

  
    return (
      <TableContainer sx={{ width:'100%' }} component={Paper}>
        <Table  aria-label="simple table">
          <TableHead>
            <TableRow>
              {
                props.fields.map( (field, i) => {
                  return <TableCell key={i} align="center">{field}</TableCell>
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            
            {
            loading ? (
                <div>
                  loading ...
                </div>
              ) :
              renderRows(props.data)
           }

          
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  const renderRows = (data) => {
    if(!data) return []
    
    let rows = [Object.keys(data).map((row, i) => {
    
    if(row === "total") return


    return (
      <TableRow
      key={row}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
      <TableCell component="th" scope="row">
        {row}
      </TableCell>
      <TableCell align="right">{data[row].amount}</TableCell>
      <TableCell align="right">{data[row].price}</TableCell>
      <TableCell align="right">{data[row].total}</TableCell>
      <TableCell align="right">{data[row].price}</TableCell>
    </TableRow>
    )

  })]

  rows.push( <TableRow
    key="total"
    sx={{ "tr": {border: 0}}}>
      <TableCell align="right">Total: </TableCell>
      <TableCell align="right">${data.total}</TableCell>

    </TableRow>)

    return rows
}