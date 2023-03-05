import DashBoard from './DashBoard'
import Banner from './Banner'
import './App.css'

function App() {
    return (
        <div className="App" style={{ width: "100vw", height: "100vh", padding: '0', margin: '0' }}>
            <Banner></Banner>
            <DashBoard></DashBoard>
        </div>
    )
}

export default App
