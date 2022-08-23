import React from 'react';
import '../styling/blackjackroom.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Card from './Card';

const MyPlayerCard = (props) => { 
    return (
        <div className={props.turn === true ? "player-card-turn" : "player-card"}>
            <div className="username">
                You ({props.username})
            </div>

            {props.readyStage === true &&
            <button 
                className={props.ready ? "ready-pressed" : "ready-not-pressed"} 
                onClick={props.onReadyPressed} 
            > 
                {props.ready ? "READY" : "Press this button when you are ready !"}
            </button>
            }

            {props.bettingStage === true && 
                <div>
                    <div className='my-betting'>Your total credits: {props.myPlayerTotalCredits}</div>

                    <div className='bet-wrapper'>
                        <div className='minus-wrapper' onClick={props.minusBet}>
                            <RemoveIcon style={{fontSize: 45}}/>
                        </div>

                        <div className='bet-amount'>{props.myPlayerBet}</div>

                        <div className='plus-wrapper' onClick={props.plusBet}>
                            <AddIcon style={{fontSize: 45}}/>
                        </div>
                    </div>

                    <div className='bet-wrapper'>
                        <button
                            className={props.betPlaced ? "bet-placed" : "place-bet"}
                            onClick={props.placeBet}
                        >
                            {props.betPlaced ? "BET PLACED" : "PLACE BET"} 
                        </button>
                    </div>
                </div> 
            }

            {props.playingStage === true &&
                <div>
                    <div className="dealer-cards">
                        {Object.entries(props.cards).map(([key, value]) => {
                            let color = key.split("_")
                            return (
                                <Card key={Math.random() * 100000} value={key} color={color[1]}/>
                            )
                        })}
                    </div>
                    <div className="score-hit-stand-wrapper">
                        <button className={props.turn ? "stand-button-turn" : "stand-button"} onClick={props.turn ? props.onStand : undefined}>STAND</button>
                        <div className="score"> Score: {props.score} </div>
                        <button className={props.turn ? "hit-button-turn" : "hit-button"} onClick={props.turn ? props.onHit: undefined}>HIT</button>
                    </div>

                    <div className="bet-bust-balance">
                        <div className="bet-playing-stage">My bet: {props.myPlayerBet}</div>
                        <div className="bust-blackjack-stand">{props.bustBlackjackStand} </div>
                        <div className="credits-playing-stage">My credits: {props.myPlayerTotalCredits}</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default MyPlayerCard