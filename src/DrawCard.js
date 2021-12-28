import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";


function DrawCard(props) {
	const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);

	useEffect(() => {
		async function getDeck() {
			let data = await axios.get(API_BASE_URL + '/new/shuffle/');
			setDeck(data.data)
		}
		getDeck();
	}, [])

	async function drawCard() {
		let { deck_id } = deck;
		let draw = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);
		const card = draw.data.cards[0];

        setDrawn(d => [
          ...d,
          {
            id: card.code,
            name: card.suit + " " + card.value,
            image: card.image
          }
        ]);
	}

	let cards = drawn.map(c => (
		<Card key={c.id} name={c.name} image={c.image} />
	));

	return (
		<div className="DrawCard">
      {drawn.length !== 52 ? (
        <button className="Deck-gimme" onClick={drawCard}>
          Draw Card
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default DrawCard;