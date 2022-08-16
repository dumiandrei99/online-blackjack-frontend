import React, {useState} from 'react'
import io from 'socket.io-client'
const socket = io.connect("http://localhost:3001")

const WelcomePage = () => {
    // url of the backend server
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false)

    const joinGame = () => {
        if (username !== '') {
            socket.emit("join-game", username, (response) => {
                if (response.message === "FULL ROOM") {
                    setError(response.message);
                    setShowError(true);
                }
                console.log(response.message)
            });
        } 
    }
    
    return (
        <div>
            <h3>Enter your username</h3>
            <input type="text" placeholder="Username..." onChange={(e) => setUsername(e.target.value)}/>
            <button onClick={joinGame}>Enter</button>
           
            {showError 
            && 
            <div> Room is already full!</div>
            }
        </div>
    )
}

export default WelcomePage