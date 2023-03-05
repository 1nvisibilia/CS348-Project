import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';

const courseSubs = [
    'Any', 'CS', 'ECE', 'MATH', 'AMATH', 'PMATH', 'SE', 'STAT', 'CO', 'A', 'B', 'Bf', '3B', 'D1', '34B'
];

export default function SearchPanel() {
    const [courseSub, setCourseSub] = useState('Any');
    const [courseCode, setCourseCode] = useState('N/A');

    const changeCourseAbr = (event) => {
        setCourseAbr(event.target.value);
    }
    const searchQuery = async () => {
        const response = await axios.get('/search', {
            params: {
                'courseSub': 'CS',
                'courseCode': '343'
            }
        });
        console.log(response);
    };
    searchQuery();

    return (
        <div>
            <FormControl fullWidth variant="standard">
                <InputLabel id="demo-simple-select-standard-label">Course Name</InputLabel>
                <Select sx={{ maxWidth: 100 }}
                    id="demo-simple-select"
                    value={courseSub}
                    label="Age"
                    onChange={setCourseSub}
                    displayEmpty
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                    {
                        courseSubs.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)
                    }
                </Select>
            </FormControl>
        </div>
    );
}