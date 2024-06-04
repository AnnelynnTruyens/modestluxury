const Shipment = () => {
	return (
		<div className="single-page-container">
			<h1>Verzending en retour</h1>

			<h2>Verzendbeleid</h2>
			<h3>Verzending binnen België</h3>
			<ul>
				<li>
					<span className="single-page__span">Levertijd</span>: Bestellingen
					worden doorgaans binnen 1-3 werkdagen verwerkt en verzonden. U
					ontvangt een bevestiging per e-mail zodra uw pakket is verzonden.
				</li>
				<li>
					<span className="single-page__span">Verzendkosten</span>: Gratis
					verzending voor bestellingen boven €50. Voor bestellingen onder dit
					bedrag rekenen we een vast tarief van €4,95.
				</li>
			</ul>
			<h3>Internationale verzending</h3>
			<ul>
				<li>
					<span className="single-page__span">Levertijd</span>: Voor
					internationale bestellingen varieert de levertijd tussen 5-10
					werkdagen, afhankelijk van de bestemming.
				</li>
				<li>
					<span className="single-page__span">Verzendkosten</span>:
					Verzendkosten voor internationale bestellingen worden berekend bij het
					afrekenen en zijn afhankelijk van de bestemming en het gewicht van het
					pakket.
				</li>
			</ul>
			<h3>Verzendbevestiging en Track & Trace</h3>
			<ul>
				<li>
					Zodra uw bestelling is verzonden, ontvangt u een verzendbevestiging
					met een Track & Trace-nummer, zodat u uw pakket kunt volgen.
				</li>
			</ul>
			<h3>Belastingen en Douanekosten</h3>
			<ul>
				<li>
					Voor internationale bestellingen kunnen extra belastingen en
					douanekosten van toepassing zijn. Deze kosten zijn de
					verantwoordelijkheid van de klant.
				</li>
			</ul>

			<h2>Retourbeleid</h2>
			<h3>Retourneren</h3>
			<ul>
				<li>
					<span className="single-page__span">Retourtermijn</span>: U heeft het
					recht om uw bestelling binnen 14 dagen na ontvangst te retourneren.
				</li>
				<li>
					<span className="single-page__span">Voorwaarden</span>: Artikelen
					moeten ongedragen, ongewassen en in originele staat met alle labels en
					verpakkingen worden geretourneerd.
				</li>
				<li>
					<span className="single-page__span">Procedure</span>: Neem contact op
					met onze klantenservice via{" "}
					<a href="mailto:info@modestluxury.be" className="single-page__link">
						info@modestluxury.be
					</a>{" "}
					om uw retour aan te melden. U ontvangt verdere instructies en een
					retourlabel.
				</li>
			</ul>
			<h3>Kosten voor Retourzending</h3>
			<ul>
				<li>
					<span className="single-page__span">Binnen België</span>: Retourkosten
					zijn gratis wanneer u ons retourlabel gebruikt.
				</li>
				<li>
					<span className="single-page__span">Internationale retouren</span>: :
					De kosten voor het retourneren van internationale bestellingen zijn de
					verantwoordelijkheid van de klant.
				</li>
			</ul>
			<h3>Terugbetalingen</h3>
			<ul>
				<li>
					<span className="single-page__span">Verwerkingstijd</span>: Zodra wij
					uw retour hebben ontvangen en gecontroleerd, streven wij ernaar om
					binnen 5 werkdagen de terugbetaling te verwerken.
				</li>
				<li>
					<span className="single-page__span">Terugbetalingsmethode</span>: : De
					terugbetaling wordt uitgevoerd via dezelfde betaalmethode die u hebt
					gebruikt bij de aankoop.
				</li>
			</ul>
			<h3>Ruilen</h3>
			<ul>
				<li>
					Wilt u een artikel ruilen? Neem contact op met onze klantenservice via{" "}
					<a href="mailto:info@modestluxury.be" className="single-page__link">
						info@modestluxury.be
					</a>{" "}
					en wij helpen u graag verder met uw ruilverzoek.
				</li>
			</ul>
			<h3>Beschadigde of Verkeerde Artikelen</h3>
			<ul>
				<li>
					Indien u een beschadigd of verkeerd artikel heeft ontvangen, neem dan
					binnen 7 dagen na ontvangst contact met ons op via{" "}
					<a href="mailto:info@modestluxury.be" className="single-page__link">
						info@modestluxury.be
					</a>{" "}
					met een foto van het probleem. Wij zorgen voor een passende oplossing.
				</li>
			</ul>

			<h2>Contactinformatie</h2>
			<p>
				Voor vragen over ons verzend- en retourbeleid kunt u contact opnemen met
				onze klantenservice via{" "}
				<a href="mailto:info@modestluxury.be" className="single-page__link">
					info@modestluxury.be
				</a>
				. Bij Modest Luxury streven we naar een soepele en zorgeloze
				winkelervaring. Uw tevredenheid is onze prioriteit. Bedankt voor uw
				vertrouwen in ons!
			</p>
		</div>
	);
};

export default Shipment;
