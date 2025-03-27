import {useEffect, useState} from "react";
import { RevealModel } from "./model/RevealModel.ts";
import "./styles/GameStart.css";
import welcomePic from "../assets/Reveal-pic.jpg";
import {HighScoreModel} from "./model/HighScoreModel.ts";

type StartGameProps = {
    user: string;
    gameReveal: RevealModel;
    gameMode: string;
    revealedTiles: number[];
    handleResetGame: () => void;
    highScoresOverTime: HighScoreModel[];
    getHighScoresOverTime: () => void;
    highScoresWithClicks: HighScoreModel[];
    getHighScoresWithClicks: () => void;
    gameFinished: boolean;
    time: number;
    numberOfClicks: number;
};

export default function StartGame(props: Readonly<StartGameProps>) {
    const [solutionWord, setSolutionWord] = useState<string>("");

    const [playerName, setPlayerName] = useState<string>("");

    // const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    // const [showAnimation, setShowAnimation] = useState<boolean>(false);
    // const [showPopup, setShowPopup] = useState<boolean>(false);

    function handleSolutionWord(event: React.FormEvent) {
        event.preventDefault();

        const correctSolutions = props.gameReveal.solutionWords.map(word => word.toLowerCase());

        if (correctSolutions.includes(solutionWord.toLowerCase())) {
            props.handleResetGame();
            alert("✅ Richtig! Spiel beendet.");
        } else {
            alert("❌ Falsch! Versuche es nochmal.");
        }

        setSolutionWord("");
    }

    function postHighScore() {
        const highScoreData = {
            playerName,
            githubId: props.user,
            category: props.gameReveal.category,
            gameMode: props.gameMode,
            scoreTime: parseFloat(props.time.toFixed(1)),
            numberOfClicks: props.numberOfClicks
        };

        console.log("High Score Data:", highScoreData);
        // Hier kannst du die Daten an eine API senden oder lokal speichern
    }


    useEffect(() => {
        props.getHighScoresOverTime();
        props.getHighScoresWithClicks();
    }, []);

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
