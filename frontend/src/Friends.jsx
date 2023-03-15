import { useState, useEffect } from 'react';
import { Paper, Divider, TextField, Button, Typography, List, ListItem, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function SearchPanel() {
    const [friends, setFriends] = useState([]);
    const [idValidity, setValid] = useState(true);
    const [newFriendID, setNewFriendID] = useState('');

    useEffect(() => {
        axios.get('/friends', { params: { userId: '10000000' } })
            .then(response => {
                setFriends(response.data);
                console.log(friends);
            })
    }, []);

    const changeId = (event) => {
        setValid(true);
        setNewFriendID(event.target.value);
    }

    const addFriend = async () => {
        console.log(newFriendID);
        if (!newFriendID || newFriendID.length !== 8) {
            setValid('Invalid ID');
            return;
        }
        const response = await axios.post('/modifyFriends', {
            userId: '10000000',
            action: 'add',
            target: newFriendID
        });
        setFriends(response.data);
    }

    const removeFriend = async (id) => {
        console.log(id)

        const response = await axios.post('/modifyFriends', {
            userId: '10000000',
            action: 'remove',
            target: id
        });
        setFriends(response.data);
    }

    return (
        <Paper style={{ margin: '0 4em', padding: '1em', display: 'flex' }}>
            <div style={{ width: '400px' }}>
                <div style={{ marginBottom: '1em' }}>My Friends</div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <TextField
                        id="standard-basic" label="User ID" variant="standard"
                        value={newFriendID}
                        style={{ width: '100px' }}
                        error={idValidity !== true}
                        onChange={changeId}
                    />
                    <Button
                        variant="contained" onClick={addFriend}>
                        Add
                    </Button>
                </div>

                <Typography variant="caption" color="red" style={{ minHeight: '1em' }}>
                    {idValidity !== true ? idValidity : "ㅤ"}
                </Typography>

                <List style={{ marginTop: '1em' }}>
                    {
                        friends.map((element, idx) =>
                            <ListItem
                                key={idx}
                                secondaryAction={
                                    <IconButton onClick={() => removeFriend(element.id)} edge="end" aria-label="delete">
                                        <DeleteIcon></DeleteIcon>
                                    </IconButton>
                                }>
                                {`${element.first_name} ${element.last_name} (${element.id})`}</ListItem>
                        )
                    }
                </List>
            </div>
            <Divider orientation="vertical" flexItem></Divider>
            <div style={{ flexBasis: '100%' }}>
                test2
            </div>
        </Paper>
    )
}