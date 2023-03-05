import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


export default function SearchPanel() {
    const courseAbrs = [
        'Any', 'CS', 'ECE', 'MATH', 'AMATH', 'PMATH', 'SE', 'STAT', 'CO', 'A', 'B', 'Bf', '3B', 'D1', '34B'
    ];
    const [courseAbr, setCourseAbr] = useState('Any');
    const [courseCode, setCourseCode] = useState('N/A');
    const [courseName, setCourseName] = useState('N/A');

    const changeCourseAbr = (event) => {
        setCourseAbr(event.target.value);
    }

    return (
        <div>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Course Name</InputLabel>
                <Select sx={{ maxWidth: 100 }}
                    id="demo-simple-select"
                    value={courseAbr}
                    label="Age"
                    onChange={changeCourseAbr}
                    displayEmpty
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                    {
                        courseAbrs.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </div>
    );
}