import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';

export default function ResultTable({ user, queryResult, actionsEnabled }) {
    const [open, setSnackbar] = useState(false);
    const [snackMsg, setMsg] = useState('');

    if (queryResult.length === 0) {
        return (
            <div style={{ margin: '8em 0' }}>
                <Typography variant="subtitle1">
                    <span>We did not find any results matching the criteria...</span>
                </Typography>
            </div>
        );
    }

    const addCourse = async (addMethod, componentID) => {
        console.log(user, addMethod, componentID);
        const response = await axios.post('/addcourse', {
            user, addMethod, componentID
        });

        if (response.data === true) {
            setMsg('Sucessfully added the component');
        } else {
            setMsg(response.data);
        }
        setSnackbar(true);
    }

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                message={snackMsg}
                onClose={() =>setSnackbar(false)}
            />
            <div style={{ margin: '2em 0' }}>
                <Typography variant="overline">
                    {actionsEnabled ? <span>{queryResult.length} results found:</span> : <span>Your Schedule:</span>}
                </Typography>
            </div>
            <TableContainer component={Paper} variant='outlined'>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Subject</TableCell>
                            <TableCell align="right">Course Code</TableCell>
                            <TableCell align="right">Type</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Capacity</TableCell>
                            {actionsEnabled && <TableCell align="right">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {queryResult.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{row.csub}</TableCell>
                                <TableCell align="right">{row.cnum}</TableCell>
                                <TableCell align="right">{row.ctype}</TableCell>
                                <TableCell align="right">
                                    {row.campoff || ''}{row.camploc ? `(${row.camploc})` : ''} {row.building || 'N/A'}{row.room || ''}
                                </TableCell>
                                <TableCell align="right">{row.enrolltot}/{row.enrollcap}</TableCell>
                                {actionsEnabled && 
                                    <TableCell align="right">
                                        <IconButton onClick={() => addCourse('add', row.id)}>
                                            <Tooltip title="Add Component" placement="top">
                                                <AddIcon></AddIcon>
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton onClick={() => addCourse('report', row.id)}>
                                            <Tooltip title="Report Component" placement="top">
                                                <InfoIcon></InfoIcon>
                                            </Tooltip>
                                        </IconButton>
                                    </TableCell>
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
