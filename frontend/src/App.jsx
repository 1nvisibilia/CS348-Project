import { useState } from 'react';
import DashBoard from './DashBoard'
import Banner from './Banner'
import Login from './Login';
import './App.css'

function App() {
    const [auth, login] = useState(null);
    const loggedin = (username) => {
        login(username);
    }
    return (
        <div className="App" style={{ width: "100vw", height: "100vh", padding: '0', margin: '0' }}>
            <Banner></Banner>
            {
                auth ? <DashBoard user={auth}></DashBoard> : <Login authSuccessCallback={loggedin}></Login>
            }
        </div>
    )
}

export default App
