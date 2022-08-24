import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socket from '../socket/socket';
import MyPlayerCard from '../components/MyPlayerCard';
import OtherPlayerCard from '../components/OtherPlayerCard';
import DealerCard from '../components/DealerCard';
import '../styling/blackjackroom.css'
import { useNavigate } from 'react-router-dom'

const BlackjackRoom = () => {
    const navigate = useNavigate()
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
    const [myPlayerTotalCredits, setMyPlayerTotalCredits] = useState(150)
    const [myPlayerBet, setMyPlayerBet] = useState(0)
    const [myPlayerBetPlaced, setMyPlayerBetPlaced] = useState(false)
    const [otherPlayerBetPlaced, setOtherPlayerBetPlaced] = useState(false)
    const [otherPlayerBetAmount, setOtherPlayerBetAmount] = useState(0)
    const [otherPlayerTotalCredits, setOtherPlayerTotalCredits] = useState(150)
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
    const [myPlayerWinOrLose, setMyPlayerWinOrLose] = useState('')
    const [otherPlayerWinOrLose, setOtherPlayerWinOrLose] = useState('')
    const [userDisconnected, setUserDisconnected] = useState(false)
    const [endGame, setEndGame] = useState(false)
    const [winner, setWinner] = useState(null)
    
    const resetLevel = async () => {
        const reset = (myCredits, otherCredits) => {
            setShowWinners(false)
            if (myCredits === 0 || otherCredits >= 500) {
                console.log("MY ZERO")
                setBettingStage(false)
                setWinner(otherUser)
                setEndGame(true)
                setTimeout(() => {
                    navigate("/")
                }, 5000)
            } else if (otherCredits === 0 || myCredits >= 500) {
                setBettingStage(false)
                setWinner(username)
                setEndGame(true)
                setTimeout(() => {
                    navigate("/")
                }, 5000)
            } else {
                setBettingStage(true)
            }
            setMyPlayerBet(0)
            setMyPlayerBetPlaced(false)
            setOtherPlayerBetPlaced(false)
            setOtherPlayerBetAmount(0)
            setBetsPlaced(false)
            setMyTurn(false)
            setOtherPlayerTurn(false)
            setDealerTurn(false)
            setMyBustBlackjackStand('')
            setOtherPlayerBustBlackjackStand('')
            setDealerBustBlackjackStand('')
            setMyPlayerWinOrLose('')
            setOtherPlayerWinOrLose('')
            setMyCards({})
            setOtherPlayerCards([])
            setDealerCards([])
            setMyScore(0)
            setOtherPlayerScore(0)
            setDealerScore(0)
        }

        console.log("AA")
        socket.emit("clean-db-tables")
        socket.emit("total-credits", username, otherUser, (response) => {
            setMyPlayerTotalCredits(response.myCredits)
            setOtherPlayerTotalCredits(response.otherCredits)
            reset(response.myCredits, response.otherCredits)
        })
    }

    // controls the order in which the players act
    useEffect(() => {
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

    // updates the new number of credits of the opponent
    useEffect(() => {
        socket.on("update-opponent-credits", (response) => {
            setOtherPlayerTotalCredits(response.credits)
        })
    })

    // decides the winners, losers and after that, restarts the round
    useEffect(() => {
        const myPlayerWins = () => {
            setMyPlayerWinOrLose('win')
            let credits = myPlayerTotalCredits + myPlayerBet * 2;
            socket.emit("update_total_credits", username, credits) 
        }
    
        const myPlayerLoses = () => {
            setMyPlayerWinOrLose('lose')
        }
    
        const otherPlayerWins = () => {
            setOtherPlayerWinOrLose('win')
        }
        
        const otherPlayerLoses = () => {
            setOtherPlayerWinOrLose('lose')
        }
    
        const myPlayerTies = () => {
            setMyPlayerWinOrLose('tie')
            let credits = myPlayerTotalCredits + myPlayerBet;
            socket.emit("update_total_credits", username, credits)
        }
    
        const otherPlayerTies = () => {
            setOtherPlayerWinOrLose('tie')
        }

        const dealerBlackjack = () => {
            setDealerBustBlackjackStand("BLACKJACK")
            socket.emit("set-other-dealer-blackjack")

            if (myBustBlackjackStand === "BLACKJACK") {
                myPlayerTies()
            } else {
                myPlayerLoses()
            }

            if (otherPlayerBustBlackjackStand === "BLACKJACK") {
                otherPlayerTies()
            } else {
                otherPlayerLoses()
            }
        }
    
        const dealerBust = () => {
            setDealerBustBlackjackStand("BUST")
            socket.emit("set-other-dealer-bust")

            if (myBustBlackjackStand !== "BUST") {
                myPlayerWins()
            } else {
                myPlayerLoses()
            }

            if (otherPlayerBustBlackjackStand !== "BUST") {
                otherPlayerWins()
            } else {
                otherPlayerLoses()
            }
        }
    
        const dealerStand = () => {
            setDealerBustBlackjackStand("STAND")
            socket.emit("set-other-dealer-stand")

            if (myBustBlackjackStand === "BUST") {
                myPlayerLoses()
            } else if (dealerScore < myScore) {
                myPlayerWins()
            } else if (dealerScore === myScore){
                myPlayerTies()
            } else {
                myPlayerLoses()
            }

            if (otherPlayerBustBlackjackStand === "BUST") {
                otherPlayerLoses()
            } else if (dealerScore < otherPlayerScore) {
                otherPlayerWins()
            } else if (dealerScore === otherPlayerScore){
                otherPlayerTies()
            } else {
                otherPlayerLoses()
            }
        }
    
        const rewardStage = () => {
            setTimeout(() => {
                setPlayingStage(false)
                setShowWinners(true)
            }, 3000)
            setTimeout(() => {
                resetLevel()
            }, 10000)
        }
        // in this situation, we don't want the dealer to draw any cards
        if (myBustBlackjackStand === "BUST" && otherPlayerBustBlackjackStand === "BUST") {  
            myPlayerLoses()
            otherPlayerLoses()
            rewardStage()
        }
        // in this situation, we don't want the dealer to draw any cards
        if (myBustBlackjackStand === "BLACKJACK" && otherPlayerBustBlackjackStand === "BLACKJACK") {
            myPlayerWins()
            otherPlayerWins()
            rewardStage()
        }
        // dealer draws cards and the winners are decided

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
                }, 500)
            } else if (dealerScore === 21) {
                dealerBlackjack()
                rewardStage()
            } else if (dealerScore > 21) { 
                dealerBust()
                rewardStage()
            } else if (dealerScore >= 17) {
                dealerStand()
                rewardStage()
            }
        }
    }, [dealerCards, myBustBlackjackStand, myScore, otherPlayerBustBlackjackStand, otherPlayerScore,
        otherUser, username, dealerScore, dealerTurn])

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
            // if a user disconnects, we redirect the remaining user home
            setOtherUser("")
            setOtherPlayerReady(false)
            setUserDisconnected(true)
            setPlayingStage(false)
            setBettingStage(false)
            setReadyStage(false)
            setShowWinners(false)
            setTimeout(() => {
                navigate("/")
            }, 5000)
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
            }, 10000)
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

                socket.emit("generate-dealer-cards", username, (response) => {
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
            console.log(response.cards)
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
                myPlayerWinTieLose={myPlayerWinOrLose}
                otherPlayerWinTieLose={otherPlayerWinOrLose}
                myPlayerBet={myPlayerBet}
                otherPlayerBet={otherPlayerBetAmount}
                otherPlayerName={otherUser}
                userDisconnected={userDisconnected}
                endGame={endGame}
                winner={winner}
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