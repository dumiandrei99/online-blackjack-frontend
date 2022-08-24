import io from 'socket.io-client'

const socket = io.connect("https://blackjack-be-andrei-dumitrescu.herokuapp.com/")

export default socket