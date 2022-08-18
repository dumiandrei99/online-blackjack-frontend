import React from 'react';
import '../styling/blackjackroom.css';

const DealerCard = (props) => {

    return (
        <div className="dealer-card">
            <div className="username">
               Dealer
            </div>

            {props.intro && 
                <div> 
                    <div className='intro'>This game will start in 15 seconds.</div>
                    <div className='intro'> The first player to run out of chips will be considered the loser. </div>
                    <div className='intro'> When the borders of your "right angle" turn red, it's your turn to act. </div> 
                    <div className='intro'> Have fun! </div>
                </div>
            }

            {props.isGameLive && 
                <div> Game is live </div>
            }
        </div>
    )
}

export default DealerCard