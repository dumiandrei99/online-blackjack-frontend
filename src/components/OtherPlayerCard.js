import React from 'react';
import '../styling/blackjackroom.css';

const OtherPlayerCard = (props) => {

    return (
        <div className="player-card">
            { props.username === "" ?
            <div className="waiting">Waiting for another player to join...</div>
            :
            <div>
                <div className="username">{props.username}</div>
                {props.isGameLive === false ? 
                <div className="opponent-ready">
                    {props.ready ? props.username + " is ready !" : props.username + " is not ready yet..."}
                </div>
                :
                <div>Game is live</div>
                }
            </div>
            }
        </div>
    )
}

export default OtherPlayerCard