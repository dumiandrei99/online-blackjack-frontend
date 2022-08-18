import React from 'react';
import '../styling/blackjackroom.css';

const MyPlayerCard = (props) => {

    return (
        <div className="player-card">
            <div className="username">
                You ({props.username})
            </div>

            {props.isGameLive === false ? 
            <button 
                className={props.ready ? "ready-pressed" : "ready-not-pressed"} 
                onClick={props.onReadyPressed} 
            > 
                {props.ready ? "READY" : "Press this button when you are ready !"}
            </button>
            :
            <div>Game is live</div>
            }

            
        </div>
    )
}

export default MyPlayerCard