import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket/socket';
import MyPlayerCard from '../components/MyPlayerCard';
import OtherPlayerCard from '../components/OtherPlayerCard';
import DealerCard from '../components/DealerCard';
import '../styling/blackjackroom.css'

const BlackjackRoom = () => {

    const { state } = useLocation()
    const { username, alreadyConnectedUser, isReady} = state
    const [otherUser, setOtherUser] = useState(alreadyConnectedUser)
    const [myPlayerReady, setMyPlayerReady] = useState(false)
    const [otherPlayerReady, setOtherPlayerReady] = useState(isReady)
    const [intro, setIntro] = useState(false)
    // first stage of the game - the users have to get ready
    const [readyStage, setReadyStage] = useState(true)
    // second stage of the game - the users have to place their bets
    const [bettingStage, setBettingStage] = useState(false)
    const [myPlayerTotalCredits, setMyPlayerTotalCredits] = useState(500)
    const [myPlayerBet, setMyPlayerBet] = useState(0)
    const [myPlayerBetPlaced, setMyPlayerBetPlaced] = useState(false)
    const [otherPlayerBetPlaced, setOtherPlayerBetPlaced] = useState(false)
    const [otherPlayerBetAmount, setOtherPlayerBetAmount] = useState(0)
    const [otherPlayerTotalCredits, setOtherPlayerTotalCredits] = useState(500)
    const [betsPlaced, setBetsPlaced] = useState(false)
    // third stage of the game - the users are dealt cards and can take actions (hit or stay)
    const [playingStage, setPlayingStage] = useState(false)
    const [turn, setTurn] = useState(1)
    const [myCards, setMyCards] = useState({})
    const [otherPlayerCards, setOtherPlayerCards] = useState([])
    const [dealerCards, setDealerCards] = useState([])
    const [myScore, setMyScore] = useState(0)
    const [otherPlayerScore, setOtherPlayerScore] = useState(0)
    const [dealerScore, setDealerScore] = useState(0)
    const [myTurn, setMyTurn] = useState(false)
    const [otherPlayerTurn, setOtherPlayerTurn] = useState(false)
    const [dealerTurn, setDealerTurn] = useState(false)
    const [myBustBlackjackStand, setMyBustBlackjackStand] = useState('')
    const [otherPlayerBustBlackjackStand, setOtherPlayerBustBlackjackStand] = useState('')
    const [dealerBustBlackjackStand, setDealerBustBlackjackStand] = useState('')
    const [showWinners, setShowWinners] = useState(false) 
    const [myPlayerWinOrLose, setMyPlayerWinOrLose] = useState(false) // false = lose, true = win
    const [otherPlayerWinOrLose, setOtherPlayerWinOrLose] = useState(false) // false = lose, true = win
    
    const resetLevel = () => {
        console.log("A")
        setShowWinners(false)
        setBettingStage(true)
        setMyPlayerBet(0)
        setMyPlayerBetPlaced(false)
        setOtherPlayerBetPlaced(false)
        setOtherPlayerBetAmount(0)
        setBetsPlaced(false)
        setTurn(1)
        setMyTurn(false)
        setOtherPlayerTurn(false)
        setDealerTurn(false)
        setMyBustBlackjackStand('')
        setOtherPlayerBustBlackjackStand('')
        setDealerBustBlackjackStand('')
        setMyPlayerWinOrLose(false)
        setOtherPlayerWinOrLose(false)
        setMyCards({})
        setOtherPlayerCards([])
        setDealerCards([])
        setMyScore(0)
        setOtherPlayerScore(0)
        setDealerScore(0)
    }

    // controls the order in which the players act
    useEffect(() => {
        console.log("B")
        socket.on("player_turn", (response) => {
            if (response.username === username) {
                setMyTurn(true)
                setOtherPlayerTurn(false)
                setTurn(response.turn)
                setDealerTurn(false)
            } else if (response.username === "dealer") {
                setMyTurn(false)
                setOtherPlayerTurn(false)
                setDealerTurn(true)
            } else {
                setMyTurn(false)
                setOtherPlayerTurn(true)
                setDealerTurn(false)
            }
        })
    }, [username])

    // controls the order in which the players act
    useEffect(() => {
        console.log("A")
        socket.emit("player-turn", turn, (response) => {
            if (response.username === username) {
                console.log("tb")
                setMyTurn(true)
                setOtherPlayerTurn(false)
                setDealerTurn(false)
            }
        })
    }, [turn, username])

    useEffect(() => {
        if (myBustBlackjackStand === "BUST" && otherPlayerBustBlackjackStand === "BUST") {
            setPlayingStage(false)
            setShowWinners(true)
            setTimeout(() => {
                resetLevel()
            }, 3000)
        }

        if (dealerTurn === true) {
            if (dealerScore < 17) {
                setTimeout(() => {
                    socket.emit("generate-dealer-card", username, (response) => {
                        let dealerPlayerCardsNewState = dealerCards
                        let arrayCardResponse = Object.entries(response.card)[0]
                        dealerPlayerCardsNewState[arrayCardResponse[0]] = arrayCardResponse[1]
                        setDealerCards(dealerPlayerCardsNewState)
                        setDealerScore(response.score)
                    })
                }, 1000)
            } else if (dealerScore === 21) {
                setDealerBustBlackjackStand("BLACKJACK")
                socket.emit("set-other-dealer-blackjack")
            } else if (dealerScore > 21) { 
                setDealerBustBlackjackStand("BUST")
                socket.emit("set-other-dealer-bust")
            } else if (dealerScore > 17) {
                setDealerBustBlackjackStand("STAND")
                socket.emit("set-other-dealer-stand")
            }
        }
    }, [dealerTurn, dealerScore, dealerCards, username, myBustBlackjackStand, myPlayerWinOrLose, otherPlayerBustBlackjackStand, otherPlayerWinOrLose])

    useEffect(() => {
        socket.on("opponent_dealer_card", (response) => {
            let dealerPlayerCardsNewState = dealerCards
            let arrayCardResponse = Object.entries(response.card)[0]
            dealerPlayerCardsNewState[arrayCardResponse[0]] = arrayCardResponse[1]
            setDealerCards(dealerPlayerCardsNewState)
            setDealerScore(response.score)
        })
    }, [dealerCards])

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

    const onHit = () => {
        socket.emit("generate-card", username, (response) => {
            let myCardsNewState = myCards
            let arrayCardResponse = Object.entries(response.card)[0]
            myCardsNewState[arrayCardResponse[0]] = arrayCardResponse[1]
            setMyCards(myCardsNewState)
            setMyScore(response.score)
        })
    }

    // make the other user see that you chose to stand
    useEffect(() => {
        socket.on("set_other_user_stand", (response) => {
            setOtherPlayerBustBlackjackStand(response.outcome)
        })
    })

    // make the other user see that your hand busted
    useEffect(() => {
        socket.on("set_other_user_bust", (response) => {
            setOtherPlayerBustBlackjackStand(response.outcome)
        })
    })

    // make the other user see that you hit a blackjack
    useEffect(() => {
        socket.on("set_other_user_blackjack", (response) => {
            setOtherPlayerBustBlackjackStand(response.outcome)
        })
    })

    // make the other user see the action of the dealer
    useEffect(() => {
        socket.on("set_other_dealer_stand", (response) => {
            setDealerBustBlackjackStand(response.outcome)
        })
    })

    useEffect(() => {
        socket.on("set_other_dealer_bust", (response) => {
            setDealerBustBlackjackStand(response.outcome)
        })
    })

    useEffect(() => {
        socket.on("set_other_dealer_blackjack", (response) => {
            setDealerBustBlackjackStand(response.outcome)
        })
    })


    const onStand = () => {
        setMyBustBlackjackStand("STAND")
        socket.emit("set-other-user-stand")
        setTurn(t => t + 1)
    }

    useEffect(() => {
        if (myScore === 21){
            setMyBustBlackjackStand("BLACKJACK")
            socket.emit("set-other-user-blackjack")
            setTurn(t => t + 1)
        }

        if (myScore > 21) {
            setMyBustBlackjackStand("BUST")
            socket.emit("set-other-user-bust")
            setTurn(t => t + 1)
        }
    }, [myScore]);

    // update the opponent's window when you're hitting a card
    useEffect(() => {
        socket.on("opponent_hit_new_card", (response) => { 
            let otherPlayerCardsNewState = otherPlayerCards
            let arrayCardResponse = Object.entries(response.card)[0]
            otherPlayerCardsNewState[arrayCardResponse[0]] = arrayCardResponse[1]
            setOtherPlayerCards(otherPlayerCardsNewState)
            setOtherPlayerScore(response.score)
        })
    })

    // users places a bet and the client sends the info to the backend via the socket
    const placeBet = () => {
        if (myPlayerBetPlaced === false && myPlayerBet > 0) {
            setMyPlayerBetPlaced(true)
            setMyPlayerTotalCredits(myPlayerTotalCredits - myPlayerBet)
            const usernameAndBet = {
                username: username,
                bet: myPlayerBet
            }
            socket.emit("placed-bet", usernameAndBet)
        }
    }

    const minusBet = () => {
        if (myPlayerBetPlaced === false && myPlayerBet - 5 >= 0 ) {
            setMyPlayerBet(myPlayerBet - 5)
        }
    }

    const plusBet = () => {
        if (myPlayerBetPlaced === false && myPlayerBet + 5 <= myPlayerTotalCredits) { 
            setMyPlayerBet(myPlayerBet + 5)
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
            setOtherPlayerReady(false)
        })
    })

    // receive message if the other user is ready 
    useEffect(() => {
        socket.on("other_user_ready", (response) => {
            setOtherPlayerReady(true)
        })
    }) 

    // receive message if the other user has placed his bet
    useEffect(() => {
        socket.on("placed_bet", (response) => {
            setOtherPlayerBetPlaced(true)
            setOtherPlayerTotalCredits(response.totalCredits)
            setOtherPlayerBetAmount(response.betAmount)
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
                setReadyStage(false)
                setBettingStage(true)
            }, 1000)
        }
    }, [myPlayerReady, otherPlayerReady, username])

    // if both users placed bets, deal the cards and let users play the game
    useEffect(() => {
        if (myPlayerBetPlaced === true && otherPlayerBetPlaced === true) {
            setBetsPlaced(true)
            setTurn(1)
            // wait 5 seconds before dealing the cards
            setTimeout(() => {
                setBetsPlaced(false)
                setBettingStage(false)

                socket.emit("generate-dealer-cards", "dealer", (response) => {
                    setDealerScore(response.score)
                    setDealerCards(response.dealerCards)
                });

                socket.emit("generate-player-cards", username, (response) => {
                    console.log(response)
                    setMyScore(response.score)
                    setMyCards(response.cards)
                })

                setPlayingStage(true)
            }, 1000)
        }
    }, [myPlayerBetPlaced, otherPlayerBetPlaced, username])

    useEffect(() => {
        socket.on("set_other_player_dealer_cards", (response) => {
            setDealerScore(response.score)
            setDealerCards(response.dealerCards)
        })
    })

    useEffect(() => {
        socket.on("set_other_player_cards", (response) => {
            setOtherPlayerScore(response.score)
            setOtherPlayerCards(response.cards)
        })
    })
    
    return(
        <div className="background">
            <DealerCard 
                intro={intro}
                bettingStage={bettingStage}
                betsPlaced={betsPlaced}
                playingStage={playingStage}
                cards={dealerCards}
                score={dealerScore}
                turn={dealerTurn && playingStage}
                bustBlackjackStand={dealerBustBlackjackStand}
                showWinners={showWinners}
                myPlayerWin={myPlayerWinOrLose}
                otherPlayerWin={otherPlayerWinOrLose}
                myPlayerBet={myPlayerBet}
                otherPlayerBet={otherPlayerBetAmount}
                otherPlayerName={otherUser}
            />
            <div className='player-cards-wrapper'>

                <MyPlayerCard
                    username={username} 
                    ready={myPlayerReady} 
                    onReadyPressed={myReadyButtonPressed}
                    readyStage={readyStage}
                    bettingStage={bettingStage}
                    placeBet={placeBet}
                    betPlaced={myPlayerBetPlaced}
                    myPlayerTotalCredits={myPlayerTotalCredits}
                    myPlayerBet={myPlayerBet}
                    minusBet={minusBet}
                    plusBet={plusBet}
                    playingStage={playingStage}
                    cards={myCards}
                    score={myScore}
                    turn={myTurn && playingStage}
                    onHit={onHit}
                    onStand={onStand}
                    bustBlackjackStand={myBustBlackjackStand}
                />

                <OtherPlayerCard 
                    username={otherUser} 
                    ready={otherPlayerReady}
                    onReadyPressed={otherReadyButtonPressed}
                    readyStage={readyStage}
                    bettingStage={bettingStage}
                    otherPlayerBetPlaced={otherPlayerBetPlaced}
                    otherPlayerBetAmount={otherPlayerBetAmount}
                    otherPlayerTotalCredits={otherPlayerTotalCredits}
                    playingStage={playingStage}
                    cards={otherPlayerCards}
                    score={otherPlayerScore}
                    turn={otherPlayerTurn && playingStage}
                    bustBlackjackStand={otherPlayerBustBlackjackStand}
                />
            </div>
        </div>
    )
}

export default BlackjackRoom