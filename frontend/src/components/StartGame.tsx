import {useEffect, useState} from "react";
import { RevealModel } from "./model/RevealModel.ts";
import "./styles/GameStart.css";
import welcomePic from "../assets/Reveal-pic.jpg";
import {HighScoreModel} from "./model/HighScoreModel.ts";
import axios from "axios";

type StartGameProps = {
    user: string;
    gameRevealByUser: RevealModel;
    gameMode: string;
    revealedTiles: number[];
    handleResetGame: () => void;
    highScoresOverTime: HighScoreModel[];
    getHighScoresOverTime: () => void;
    highScoresWithClicks: HighScoreModel[];
    getHighScoresWithClicks: () => void;
    gameFinished: boolean;
    setGameFinished: (gameFinished: boolean) => void;
    time: number;
    numberOfClicks: number;
    showPreviewMode: boolean;
    setShowPreviewMode: (gameStarted: boolean) => void;
    setShowSolutionWords: (showSolutionWords: boolean) => void;
    showNameInput: boolean;
    setShowNameInput: (showNameInput: boolean) => void;
    showFullImage: boolean;
    setShowFullImage: (showFullImage: boolean) => void;
};

export default function StartGame(props: Readonly<StartGameProps>) {
    const [solutionWord, setSolutionWord] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("");
    const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [showAnimation, setShowAnimation] = useState<boolean>(false);


    function handleSolutionWord(event: React.FormEvent) {
        event.preventDefault();
        const correctSolutions = props.gameRevealByUser.solutionWords.map(word => word.toLowerCase());

        if (correctSolutions.includes(solutionWord.toLowerCase())) {
            props.setGameFinished(true);
        }
        setSolutionWord("");
    }

    function checkForHighScore() {
        const highScores = props.gameMode === "REVEAL_WITH_CLICKS" ? props.highScoresWithClicks : props.highScoresOverTime;

        if (highScores.length < 10) {
            setIsNewHighScore(true);
            props.setShowNameInput(true);
            return;
        }
        const lowestHighScore = highScores[highScores.length - 1];

        const isBetterScore = props.gameMode === "REVEAL_WITH_CLICKS"
            ? props.numberOfClicks < lowestHighScore.numberOfClicks
            : props.time < lowestHighScore.scoreTime;

        if (isBetterScore) {
            setIsNewHighScore(true);
            props.setShowNameInput(true);
        }else{
            return;
        }
    }

    function postHighScore() {
        const highScoreData = {
            id: null,
            playerName,
            githubId: props.user,
            category: props.gameRevealByUser.category,
            gameMode: props.gameMode,
            scoreTime: parseFloat(props.time.toFixed(1)),
            numberOfClicks: props.numberOfClicks,
            date: new Date().toISOString()
        };
        console.log("High Score Data:", highScoreData);

        axios
            .post("/api/high-score", highScoreData)
            .then(() => {
                props.setShowNameInput(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function handleSaveHighScore() {
        if (playerName.trim().length < 3) {
            setPopupMessage("Your name must be at least 3 characters long!");
            setShowPopup(true);
            return;
        }
        postHighScore();
        props.setShowNameInput(false);
    }

    useEffect(() => {
        props.getHighScoresOverTime();
        props.getHighScoresWithClicks();
    }, []);

    useEffect(() => {
        if(props.gameFinished){
            setShowAnimation(true);
            checkForHighScore();
            props.setShowFullImage(true);
            props.setShowSolutionWords(true);
            setTimeout(() => {
                setShowAnimation(false);
            }, 3000);
        }
    }, [props.gameFinished]);


    return (
        <>
            {!props.gameFinished &&
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
            }


            {/* Spielername Eingabefeld, wenn ein neuer Highscore erreicht wurde */}
            {isNewHighScore && props.showNameInput && (
                <div className="high-score-input">
                    <label htmlFor="playerName">Congratulations! You secured a spot on the high score list. Enter your name:</label>
                    <input
                        className="playerName"
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <button className="button-group-button" id="button-border-animation" onClick={handleSaveHighScore}>
                        Save Highscore
                    </button>
                </div>
            )}

            {showAnimation && (
                <div className="win-animation">
                    {props.gameMode === "REVEAL_WITH_CLICKS" && <p>You completed the reveal Game game in {props.numberOfClicks} clicks!</p>}
                    {props.gameMode === "REVEAL_OVER_TIME" && <p>You completed the reveal Game game in {props.time.toFixed(1)} seconds!</p>}
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Hinweis</h3>
                        <p>{popupMessage}</p>
                        <div className="popup-actions">
                            <button onClick={() => setShowPopup(false)} className="popup-confirm">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="reveal-container">

                <img className="reveal-pic" src={props.gameRevealByUser.imageUrl} alt={props.gameRevealByUser.name} />

                <div className={`mosaic-grid ${props.showFullImage ? "show-full-image" : ""}`}>
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
