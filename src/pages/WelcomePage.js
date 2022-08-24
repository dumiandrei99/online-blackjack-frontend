import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../socket/socket'
import '../styling/blackjackroom.css'

const WelcomePage = () => {
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    const joinGame = () => {
        if (username !== '') {
            // try to join the blackjack game
            socket.emit("join-game", username, (response) => {
                // if the room is full or the user has provided an existent username, show an error message
                if (response.message !== "USER CONNECTED") {
                    setError(response.message);
                    setShowError(true);
                } else {
                    // if there is available room in the room, navigate the user to the blackjack table
                    console.log(response)
                    navigate('/blackjack', { state: { username: username, alreadyConnectedUser: response.connectedUser, isReady: response.isReady}})
                }
            });
        } 
    }
    
    return (
        <div className='background-welcome'>
            <div>
                <input className="welcome-input" type="text" placeholder="Enter your username..." onChange={(e) => setUsername(e.target.value)}/>
                <button className="welcome-button" onClick={joinGame}>Enter</button>
                {showError 
                && 
                <div className="welcome-error">{error}</div>
                }
            </div>
            
        </div>
    )
}

export default WelcomePage