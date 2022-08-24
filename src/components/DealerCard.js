import React from 'react';
import '../styling/blackjackroom.css';
import Card from './Card';

const DealerCard = (props) => {
    return (
        <div className={props.turn === true ? "dealer-card-turn" : "dealer-card"}>

            <div className="username">
               Dealer
            </div>

            {props.intro && 
                <div> 
                    <div className='intro'> This game will start in 10 seconds. </div>
                    <div className='intro'> There are two ways to win: you either get to 500 credits or your opponent to 0.</div>
                    <div className='intro'> Betting is done by both players at the same time.</div>
                    <div className='intro'> When the borders turn red, it's your turn to act. </div> 
                    <div className='intro'> Have fun! </div>
                </div>
            }

            {props.bettingStage && 
                <div>
                    {props.betsPlaced === false && 
                        <div>
                            <div className='intro'>Place your bets.</div>
                            <div className='intro'>After all the players placed their bet, the cards will be dealt.</div>
                        </div>
                    }

                    {props.betsPlaced === true && 
                        <div>
                            <div className='intro'>All bets are placed.</div>
                            <div className='intro'>You will now be dealt cards. Good luck!</div>
                        </div>
                    }
                </div>
            }

            {props.playingStage &&
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
                    <div className="bust-blackjack-stand-dealer">{props.bustBlackjackStand} </div>
                </div>
            </div>
            }

            {props.showWinners &&
            <div>
                {props.myPlayerWinTieLose === 'win' &&
                <div className="intro">Congratulations! You've beaten the dealer and won {props.myPlayerBet * 2} credits! </div>
                }

                {props.myPlayerWinTieLose === 'lose' &&
                <div className="intro">Unfortunately, you lost this hand and the initial bet of {props.myPlayerBet} credits.</div>
                }
                
                {props.myPlayerWinTieLose === 'tie' &&
                <div className="intro">You have tied with the dealer and got back your initial bet of {props.myPlayerBet}!</div>
                }

                {props.otherPlayerWinTieLose === 'win' &&
                <div className="intro">{props.otherPlayerName} has beaten the dealer and won {props.otherPlayerBet * 2} credits!</div>
                }

                {props.otherPlayerWinTieLose === 'lose' &&
                <div className="intro">{props.otherPlayerName} lost to the dealer and his initial bet of {props.otherPlayerBet}.</div>
                }

                {props.otherPlayerWinTieLose === 'tie' &&
                <div className="intro">{props.otherPlayerName} has tied with the dealer and got back his initial bet of {props.otherPlayerBet}!</div>
                }

                <div className="intro"> The game will restart in 10 seconds. Good luck! </div>
            </div>
            }
            
            {props.userDisconnected &&
            <div>
                <div className="intro">The other user has disconnected.</div>
                <div className="intro">You will be redirected to the home page in 5 seconds.</div>
            </div>
            }

            {props.endGame &&
            <div>
                <div className="intro">{props.winner} has won this game! </div>
                <div className='intro'>You will soon be redirected to the starting page!</div>
            </div>
            }
        </div>
    )
}

export default DealerCard