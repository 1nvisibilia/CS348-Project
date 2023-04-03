import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';

export default function ResultTable({ user, queryResult, deleteEnabled, onChange }) {
    const [open, setSnackbar] = useState(false);
    const [snackMsg, setMsg] = useState('');

    if (queryResult.length === 0) {
        return (
            <div style={{ margin: '8em 0' }}>
                <Typography variant="subtitle1">
                    {deleteEnabled ? <span>You are not enrolled in any courses</span> : <span>We did not find any results matching the criteria...</span>}
                </Typography>
            </div>
        );
    }

    const addCourse = async (addMethod, componentID) => {
        console.log(user, addMethod, componentID);
        const response = await axios.post('/modifyCourse', {
            user, addMethod, componentID
        });

        if (response.data === true) {
            setMsg('Sucessfully added the component');
        } else {
            setMsg(response.data);
        }
        setSnackbar(true);
    }

    const removeCourse = async (componentID) => {
        const response = await axios.delete('/modifyCourse', {
            params: {
                userId: user,
                target: componentID
            }
        })

        const courseResponse = await axios.get('/schedule', { params: { userId: user } });
        onChange(courseResponse.data)
    }

    const renderActions = (id) => {
        if (deleteEnabled) {
            return (
                <IconButton aria-label="Remove component" onClick={() => removeCourse(id)}>
                    <Tooltip title='Remove Component' placement='top'>
                        <DeleteIcon />
                    </Tooltip>
                </IconButton>
            )
        }
        return (
            <>
                <IconButton aria-label="Add Component" onClick={() => addCourse('add', id)}>
                    <Tooltip title="Add Component" placement="top">
                        <AddIcon></AddIcon>
                    </Tooltip>
                </IconButton>
                <IconButton aria-label="Report Component" onClick={() => addCourse('report', id)}>
                    <Tooltip title="Report Component" placement="top">
                        <InfoIcon></InfoIcon>
                    </Tooltip>
                </IconButton>
            </>
        )
    }

    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                message={snackMsg}
                onClose={() => setSnackbar(false)}
            />
            <div style={{ margin: '2em 0' }}>
                <Typography variant="overline">
                    {!deleteEnabled ? <h1>{queryResult.length} results found:</h1> : <h1>Your Schedule:</h1>}
                </Typography>
            </div>
            <TableContainer component={Paper} variant='outlined' role="main">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Subject</TableCell>
                            <TableCell align="right">Course Code</TableCell>
                            <TableCell align="right">Type</TableCell>
                            <TableCell align="right">Location</TableCell>
                            <TableCell align="right">Capacity</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Actions</TableCell>
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
                                <TableCell align="right">
                                    {
                                        row.weekday && row.starttime && row.endtime
                                            ? row.weekday + " " + row.starttime.slice(0, -3) + "-" + row.endtime.slice(0, -3)
                                            : <Tooltip title='This component does not have in-person activities' placement='top'><span>N/A</span></Tooltip>
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {renderActions(row.id)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
