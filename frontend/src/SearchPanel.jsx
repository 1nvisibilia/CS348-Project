import { useState } from 'react';
import axios from 'axios';
import ResultTable from './ResultTable';
import { Select, MenuItem, FormControl, InputLabel, TextField, Button, Box, Collapse, Paper, Typography } from '@mui/material';
import { TableContainer, Table, TableHead, TableCell, TableRow, TableBody } from '@mui/material'
import { courseSubs } from './courseSubjects';

export default function SearchPanel({ user }) {
    // main queries
    const [courseSub, setCourseSub] = useState('Any');
    const [courseCode, setCourseCode] = useState('');
    const [avail, setAvail] = useState('All');
    const [courseType, setCourseType] = useState('Any');
    // advanced queries
    const [courseName, setCourseName] = useState('');
    const [credit, setCredit] = useState('Any');
    const [campusOff, setCampusOff] = useState('Any');
    const [building, setBuilding] = useState('');
    const [room, setRoom] = useState('');

    const [showAdvanced, toggleAdvanced] = useState(false);
    const [numberValidity, setValid] = useState(true);
    const [matchAll, setMatchAll] = useState(true);
    const [queryResult, setResult] = useState(null);

    const [popularCourses, setPopularCourses] = useState([]);

    const checkNumberValidity = (courseNum) => {
        const valid = courseNum === '' || (0 < parseInt(courseNum) && parseInt(courseNum) < 1000);
        setValid(valid);
        return valid;
    }

    const getPopularCourses = async () => {
        const response = await axios.get('/popular');
        setPopularCourses(response.data);
    }

    const searchQuery = async () => {
        const response = await axios.get('/search', {
            params: {
                courseSub: courseSub === 'Any' ? null : courseSub,
                courseCode: courseCode === '' ? null : courseCode,
                avail: avail === 'All' ? null : avail,
                courseType: courseType === 'Any' ? null : courseType,

                courseName: (!showAdvanced || courseName === '') ? null : courseName,
                credit: (!showAdvanced || credit === 'Any') ? null : credit,
                campusOff: (!showAdvanced || credit === 'Any') ? null : campusOff,
                building: (!showAdvanced || building === '') ? null : building,
                room: (!showAdvanced || room === '') ? null : room,

                searchAll: matchAll
            }
        });
        console.log(response);
        setResult(response.data);
    };

    return (
        <Paper style={{ margin: '0 4em', padding: '2em' }}>
            <h1>Course Search</h1>
            <div role="main">
                <Box style={{ margin: '0 0 2em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <FormControl>
                        <InputLabel aria-label="Course Name">Course Name</InputLabel>
                        <Select sx={{ width: 120 }}
                            id="demo-simple-select"
                            value={courseSub}
                            label="Age"
                            onChange={(event) => setCourseSub(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                courseSubs.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <TextField
                            id="standard-basic" label="Course Code" variant="standard"
                            placeholder="Any"
                            style={{ width: '100px' }}
                            type='number' error={!numberValidity}
                            onChange={(event) => checkNumberValidity(event.target.value) && setCourseCode(event.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel aria-label="Availability">Availability</InputLabel>
                        <Select sx={{ width: 100 }}
                            id="demo-simple-select"
                            value={avail}
                            onChange={(event) => setAvail(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                ['Available Only', 'All'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel aria-label="Course Type">Course Type</InputLabel>
                        <Select sx={{ width: 100 }}
                            id="demo-simple-select"
                            value={courseType}
                            onChange={(event) => setCourseType(event.target.value)}
                            displayEmpty
                            variant='standard'
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                        >
                            {
                                ['Any', 'LEC', 'TUT', 'TST', 'LAB'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Collapse in={showAdvanced}>
                    <hr style={{ margin: '1em 0' }}></hr>
                    <Box style={{ margin: '0 0 2em', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <FormControl>
                            <TextField
                                id="standard-basic" label="Course Name" variant="standard"
                                value={courseName} type="search"
                                style={{ width: '100px' }}
                                onChange={(event) => setCourseName(event.target.value)}
                            />
                        </FormControl>
                        <FormControl >
                            <InputLabel aria-label="Credit">Credit</InputLabel>
                            <Select sx={{ width: 120 }}
                                id="demo-simple-select"
                                value={credit}
                                onChange={(event) => setCredit(event.target.value)}
                                displayEmpty
                                variant='standard'
                                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                            >
                                {
                                    ['Any', '0.5', '0.25'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel aria-label="Campus Location">Campus Location</InputLabel>
                            <Select sx={{ width: 120 }}
                                id="demo-simple-select"
                                value={campusOff}
                                onChange={(event) => setCampusOff(event.target.value)}
                                displayEmpty
                                variant='standard'
                                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                            >
                                {
                                    ['Any', 'UW', 'ONLN'].map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="standard-basic" label="Building" variant="standard"
                                value={building} type="search"
                                style={{ width: '100px' }}
                                onChange={(event) => setBuilding(event.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="standard-basic" label="Room" variant="standard"
                                value={room} type="search"
                                style={{ width: '100px' }}
                                onChange={(event) => setRoom(event.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Collapse>
            </div>

            <Button
                style={{ margin: '0 1em' }}
                variant="contained" onClick={() => { toggleAdvanced(!showAdvanced) }}>
                {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
            </Button>
            <Button
                style={{ margin: '0 1em' }}
                variant="contained" onClick={() => { setMatchAll(!matchAll) }}>
                {matchAll ? 'Search for All' : 'Search for Any'}
            </Button>
            <Button
                style={{ margin: '0 1em' }}
                variant="contained" onClick={searchQuery}>
                Search
            </Button>

            {
                (queryResult && (typeof queryResult === 'object'))
                    ? <ResultTable user={user} queryResult={queryResult} deleteEnabled={false}></ResultTable> : <></>
            }

            <div style={{ margin: '4em 0 1em' }}>
                <Typography>
                    <span>Not sure what to pick? Check out the most popular courses right now</span>
                </Typography>
                <Button onClick={getPopularCourses}>See popular courses</Button>
            </div>

            {
                popularCourses.length > 0
                    ? <TableContainer component={Paper} variant='outlined'>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Subject</TableCell>
                                    <TableCell align="right">Course Code</TableCell>
                                    <TableCell align="right">Likes</TableCell>
                                    <TableCell align="right">Popularity</TableCell>
                                    <TableCell align="right">Capacity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {popularCourses.map((row, i) => (
                                    <TableRow
                                        key={i}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="right">{row.csub}</TableCell>
                                        <TableCell align="right">{row.cnum}</TableCell>
                                        <TableCell align="right">{row.likes}</TableCell>
                                        <TableCell align="right">{row.cnum}</TableCell>
                                        <TableCell align="right">{row.totEnroll}/{row.totalCap}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : <></>
            }
        </Paper>
    );
}
