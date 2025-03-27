import { useState } from "react";
import { RevealModel } from "./model/RevealModel.ts";
import "./styles/GameStart.css";
import welcomePic from "../assets/Reveal-pic.jpg";

type StartGameProps = {
    gameReveal: RevealModel;
    gameFinished: boolean;
    setGameFinished: (gameFinished: boolean) => void;
    gameMode: string;
    revealedTiles: number[];
    setRevealedTiles: (tiles: number[]) => void;
    handleResetGame: () => void;
};

export default function StartGame(props: Readonly<StartGameProps>) {
    const [solutionWord, setSolutionWord] = useState<string>("");

    function handleSolutionWord(event: React.FormEvent) {
        event.preventDefault();

        const correctSolutions = props.gameReveal.solutionWords.map(word => word.toLowerCase());

        if (correctSolutions.includes(solutionWord.toLowerCase())) {
            props.setGameFinished(true);
            alert("✅ Richtig! Spiel beendet.");
            props.setGameFinished(true);
            props.handleResetGame();
        } else {
            alert("❌ Falsch! Versuche es nochmal.");
        }

        setSolutionWord("");
    }

    return (
        <>
            <form className="solution-word-container space-between" onSubmit={handleSolutionWord}>
                <label htmlFor="solution">Solution-Word:</label>
                <input
                    id="solution-input"
                    className={`border-input${props.gameMode === "REVEAL_WITH_CLICKS" ? "-yellow" : "-purple"}`}
                    type="text"
                    value={solutionWord}
                    onChange={(e) => setSolutionWord(e.target.value)}
                />
                <button className="button-group-button" type="submit">Check Solution</button>
            </form>

            <div className="reveal-container">
                <img className="reveal-pic" src={props.gameReveal.imageUrl} alt={props.gameReveal.name} />

                <div className="mosaic-grid">
                    {[...Array(36)].map((_, index) => (
                        <div
                            key={index}
                            className={`mosaic-tile ${props.revealedTiles.includes(index) ? "hidden" : ""}`}
                            style={{
                                backgroundImage: `url(${welcomePic})`,
                                backgroundSize: 'cover',
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </>
    );
}
