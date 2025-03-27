import { useState } from "react";
import { RevealModel } from "./model/RevealModel.ts";
import "./styles/GameStart.css";
import welcomePic from "../assets/Reveal-pic.jpg"

type StartGameProps = {
    gameReveal: RevealModel;
    gameFinished: boolean;
    setGameFinished: (gameFinished: boolean) => void;
    gameMode: string;
};

export default function StartGame(props: Readonly<StartGameProps>) {
    const [solutionWord, setSolutionWord] = useState<string>("");
    const [revealedTiles, setRevealedTiles] = useState<number[]>([]); // Speichert aufgedeckte Kacheln

    const totalTiles = 36;

    function handleSolutionWord(event: React.FormEvent) {
        event.preventDefault();

        const correctSolutions = props.gameReveal.solutionWords.map(word => word.toLowerCase());

        if (correctSolutions.includes(solutionWord.toLowerCase())) {
            props.setGameFinished(true);
            alert("✅ Richtig! Spiel beendet.");
        } else {
            alert("❌ Falsch! Versuche es nochmal.");
        }

        setSolutionWord("");
    }

    function revealField() {
        // Erstelle ein Array mit Indizes von 0 bis totalTiles - 1
        const hiddenFields = Array.from({ length: totalTiles }, (_, index) => index).filter(
            (index) => !revealedTiles.includes(index)
        );

        // Wenn es noch versteckte Felder gibt
        if (hiddenFields.length > 0) {
            // Wähle zufällig ein Feld aus den noch nicht aufgedeckten Feldern
            const randomIndex = hiddenFields[Math.floor(Math.random() * hiddenFields.length)];

            // Füge das zufällig gewählte Feld zu den aufgedeckten Feldern hinzu
            setRevealedTiles((prevTiles) => [...prevTiles, randomIndex]);
        }
    }


    return (
        <>
            <form className="solution-word-container space-between" onSubmit={handleSolutionWord}>
                <label htmlFor="solution">Solution-Words:</label>
                <input
                    id="solution-input"
                    className={`border-input${props.gameMode === "REVEAL_WITH_CLICKS" ? "-yellow" : "-purple"}`}
                    type="text"
                    value={solutionWord}
                    onChange={(e) => setSolutionWord(e.target.value)}
                />
                <button className="button-group-button" type="submit">Check</button>
            </form>

            <div className="reveal-container">
                {/* Das eigentliche Bild */}
                <img className="reveal-pic" src={props.gameReveal.imageUrl} alt={props.gameReveal.name} />

                {/* Mosaik-Grid */}
                <div className="mosaic-grid">
                    {[...Array(totalTiles)].map((_, index) => (
                        <div
                            key={index}
                            className={`mosaic-tile ${revealedTiles.includes(index) ? "hidden" : ""}`}
                            style={{
                                backgroundImage: `url(${welcomePic})`,
                                backgroundSize: 'cover',
                            }}
                        ></div>
                    ))}
                </div>
            </div>


            <button onClick={revealField}>Reveal More</button>
        </>
    );
}
