import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket/socket';
import MyPlayerCard from '../components/MyPlayerCard';
import OtherPlayerCard from '../components/OtherPlayerCard';
import DealerCard from '../components/DealerCard';
import '../styling/blackjackroom.css'

const BlackjackRoom = () => {

    const { state } = useLocation()
    const { username, alreadyConnectedUser, isReady } = state
    const [ otherUser, setOtherUser] = useState(alreadyConnectedUser)
    const [myPlayerReady, setMyPlayerReady] = useState(false)
    const [otherPlayerReady, setOtherPlayerReady] = useState(isReady)
    const [intro, setIntro] = useState(false)
    const [isGameLive, setIsGameLive] = useState(false)

    const myReadyButtonPressed = () => {
        if (myPlayerReady !== true) {
            setMyPlayerReady(true)
            socket.emit("user-ready", username)
        }
    }

    const otherReadyButtonPressed = () => {
        if (otherPlayerReady !== true) { 
            setOtherPlayerReady(true)
            socket.emit("user-ready", username)
        }
    }
 
    // disconnect the user from the room if he presses the "back" button on the browser
    useEffect(() => {    
        return () => {
            socket.emit("leave-room", username)
        }
    }, [username])

    // receive message if somebody new connected to the room
    useEffect(() => {
        socket.on("user_connected", (response) => {
            setOtherUser(response)
        })
    })

    // receive message if somebody disconnected out of the room
    useEffect(() => {
        socket.on("user_disconnected", (response) => {
            console.log("the other user disconnected");
            setOtherUser("")
        })
    })

    // receive message if the other user is ready 
    useEffect(() => {
        socket.on("other_user_ready", (response) => {
            setOtherPlayerReady(true)
        })
    })

    // if both users are ready, start the game
    useEffect(() => {
        if (myPlayerReady === true && otherPlayerReady === true) {
            // intro for the users
            setIntro(true)

            // wait 10 seconds before the game starts in order to allow the users
            // to read what the dealer has to say
            setTimeout(() => {
                setIntro(false)
                setIsGameLive(true)
            }, 15000)
        }
    }, [myPlayerReady, otherPlayerReady])

    return (
        <div className="background">
            <DealerCard 
                intro={intro}
            />
            <div className='player-cards-wrapper'>

                <MyPlayerCard
                    username={username} 
                    ready={myPlayerReady} 
                    onReadyPressed={myReadyButtonPressed}
                    isGameLive={isGameLive}
                />

                <OtherPlayerCard 
                    username={otherUser} 
                    ready={otherPlayerReady}
                    onReadyPressed={otherReadyButtonPressed}
                    isGameLive={isGameLive}
                />
            </div>
        </div>
    )
}

export default BlackjackRoom