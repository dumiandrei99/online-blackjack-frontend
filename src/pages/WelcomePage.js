import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../socket/socket'

const WelcomePage = () => {
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()


    const joinGame = () => {
        if (username !== '') {
            // try to join the blackjack game
            socket.emit("join-game", username, (response) => {
                // if the room is full, show an error message
                if (response.message === "FULL ROOM") {
                    setError(response.message);
                    setShowError(true);
                } else {
                    // if there is available room in the room, navigate the user to the blackjack table
                    console.log(response)
                    navigate('/blackjack', { state: { username: username, alreadyConnectedUser: response.connectedUser, isReady: response.isReady} })
                }
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
            <div>{error}</div>
            }
        </div>
    )
}

export default WelcomePage