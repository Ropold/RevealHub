import { RevealModel } from "./model/RevealModel.ts";
import "./styles/GameStart.css";
import { useState } from "react";

type StartGameProps = {
    gameReveal: RevealModel;
    gameFinished: boolean;
    setGameFinished: (gameFinished: boolean) => void;
    gameMode: string;
};

export default function StartGame(props: Readonly<StartGameProps>) {
    const [solutionWord, setSolutionWord] = useState<string>("");

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


            <div>
                <h2>Game started</h2>
                <img className="reveal-pic" src={props.gameReveal.imageUrl} alt={props.gameReveal.name} />
            </div>
        </>
    );
}
