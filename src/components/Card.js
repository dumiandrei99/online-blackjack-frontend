import styled from "styled-components";

const map = new Map([
    // hearts
    ["two_hearts", "🂢"],
    ["three_hearts", "🂣"],
    ["four_hearts", "🂤"],
    ["five_hearts", "🂥"],
    ["six_hearts", "🂦"],
    ["seven_hearts", "🂧"],
    ["eight_hearts", "🂨"],
    ["nine_hearts", "🂩"],
    ["ten_hearts", "🂪"],
    ["jack_hearts", "🂫"],
    ["queen_hearts", "🂭"],
    ["king_hearts", "🂮"],
    ["ace_hearts", "🂡"],

    // spades
    ["two_spades", "🂢"],
    ["three_spades", "🂣"],
    ["four_spades", "🂤"],
    ["five_spades", "🂥"],
    ["six_spades", "🂦"],
    ["seven_spades", "🂧"],
    ["eight_spades", "🂨"],
    ["nine_spades", "🂩"],
    ["ten_spades", "🂪"],
    ["jack_spades", "🂫"],
    ["queen_spades", "🂭"],
    ["king_spades", "🂬"],
    ["ace_spades", "🂡"],

    // diamonds
    ["two_diamonds", "🃂"],
    ["three_diamonds", "🃃"],
    ["four_diamonds", "🃄"],
    ["five_diamonds", "🃅"],
    ["six_diamonds", "🃆"],
    ["seven_diamonds", "🃇"],
    ["eight_diamonds", "🃈"],
    ["nine_diamonds", "🃉"],
    ["ten_diamonds", "🃊"],
    ["jack_diamonds", "🃋"],
    ["queen_diamonds", "🃍"],
    ["king_diamonds", "🃌"],
    ["ace_diamonds", "🃁"],

    // clubs
    ["two_clubs", "🃒"],
    ["three_clubs", "🃓"],
    ["four_clubs", "🃔"],
    ["five_clubs", "🃕"],
    ["six_clubs", "🃖"],
    ["seven_clubs", "🃗"],
    ["eight_clubs", "🃘"],
    ["nine_clubs", "🃙"],
    ["ten_clubs", "🃚"],
    ["jack_clubs", "🃛"],
    ["queen_clubs", "🃝"],
    ["king_clubs", "🃜"],
    ["ace_clubs", "🃑"],
]);

const RedCardBox = styled.div`
  color: red;
  float: left;
  align-items:center;
  justify-content: center;
  font-size: 8rem;
`;

const BlackCardBox = styled.div`
  color: black;
  float: left;
  align-items:center;
  justify-content: center;
  font-size: 8rem;
`;

function Card({ value, color }) {
  if (color === 'clubs' || color === 'spades') {
    return <BlackCardBox>{map.get(value)}</BlackCardBox>;
  }
  return <RedCardBox>{map.get(value)}</RedCardBox>;
}

export default Card;
