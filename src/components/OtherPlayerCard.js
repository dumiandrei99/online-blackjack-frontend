import React from 'react';
import '../styling/blackjackroom.css';
import Card from './Card';

const OtherPlayerCard = (props) => {
    
    return (
        <div className={props.turn === true ? "player-card-turn" : "player-card"}>
            { props.username === "" ?
            <div className="waiting">Waiting for another player to join...</div>
            :
            <div>
                <div className="username">{props.username}</div>

                {props.readyStage === true && 
                <div className="opponent-ready">
                    {props.ready ? props.username + " is ready !" : props.username + " is not ready yet..."}
                </div>
                }

                {props.bettingStage === true && 
                <div>
                    {props.otherPlayerBetPlaced === false && 
                        <div className="opponent-ready">{props.username} is placing his bet...</div>
                    }

                    {props.otherPlayerBetPlaced === true &&
                        <div> 
                            <div className="bet-placed">{props.username} has placed his bet: {props.otherPlayerBetAmount} credits.</div>
                            <div className="bet-placed">He has a total of {props.otherPlayerTotalCredits} credits left.</div>
                        </div>
                    }
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
                        <div className="score"> Score: {props.score} </div>
                    </div>

                    <div className="bet-bust-balance">
                        <div className="bet-playing-stage">Bet: {props.otherPlayerBetAmount}</div>
                        <div className="bust-blackjack-stand">{props.bustBlackjackStand} </div>
                        <div className="credits-playing-stage">Credits: {props.otherPlayerTotalCredits}</div>
                    </div>
                </div>
                }
            </div>
            }
        </div>
    )
}

export default OtherPlayerCard