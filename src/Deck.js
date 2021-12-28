import { useEffect, useState, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const API_BASE_URL = "http://deckofcardsapi.com/api/deck";


function Deck() {
	const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [autoDraw, setAutoDraw] = useState(false);
  const timerRef = useRef(null);

	useEffect(() => {
		async function getDeck() {
			let data = await axios.get(API_BASE_URL + '/new/shuffle/');
			setDeck(data.data)
		}
		getDeck();
	}, [])

	useEffect(() => {
		/* Draw a card via API, add card to state "drawn" list */
		async function getCard() {
			let { deck_id } = deck;

			try {
				let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);

				const card = drawRes.data.cards[0];

				setDrawn(d => [
					...d,
					{
						id: card.code,
						name: card.suit + " " + card.value,
						image: card.image
					}
				]);

				if (drawRes.data.remaining === 0) {
					setAutoDraw(false);
					throw new Error("no cards remaining!");
				}

			} catch (err) {
				alert(err);
			}
		}

		if (autoDraw && !timerRef.current) {
			timerRef.current = setInterval(async () => {
				await getCard();
			}, 1000);
		}

		return () => {
			clearInterval(timerRef.current);
			timerRef.current = null;
		};
	}, [autoDraw, setAutoDraw, deck]);

	const toggleAutoDraw = () => {
		setAutoDraw(auto => !auto);
	};

	let cards = drawn.map(c => (
		<Card key={c.id} name={c.name} image={c.image} />
	));

	return (
		<div className="DrawCard">
      {drawn.length !== 52 ? (
        <button className="Deck-gimme" onClick={toggleAutoDraw}>
          {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
        </button>
      ) : null}
      <div className="Deck-cardarea">{cards}</div>
    </div>
  );
}

export default Deck;