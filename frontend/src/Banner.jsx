import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function MyApp() {
    return <Paper elevation={0} style={{ padding: '1em 0' }}>
        <Typography variant="h4">
            <span style={{ color: 'red' }}>MyS</span>chedule
        </Typography>
    </Paper>
}
