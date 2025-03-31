import PreviewPlay from "./PreviewPlay.tsx";
import { RevealModel } from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import StartGame from "./StartGame.tsx";
import {Category} from "./model/Category.ts";
import {GameMode} from "./model/GameMode.ts";
import "./styles/Play.css"
import {HighScoreModel} from "./model/HighScoreModel.ts";

type PlayProps = {
    user: string;
    highScoresOverTime: HighScoreModel[];
    getHighScoresOverTime: () => void;
    highScoresWithClicks: HighScoreModel[];
    getHighScoresWithClicks: () => void;
    activeReveals: RevealModel[];
    getActiveReveals: () => void;
};

export default function Play(props: Readonly<PlayProps>) {
    const [revealsByCategory, setRevealsByCategory] = useState<RevealModel[]>([]);
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [gameRevealByUser, setGameRevealByUser] = useState<RevealModel | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [randomCategorySelected, setRandomCategorySelected] = useState<boolean>(false);
    const [gameMode, setGameMode] = useState<GameMode>("REVEAL_WITH_CLICKS");
    const [showSolutionWords, setShowSolutionWords] = useState<boolean>(false);
    const [showFullImage, setShowFullImage] = useState<boolean>(false);

    const [numberOfClicks, setNumberOfClicks] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const totalTiles = 36;

    function selectedRevealsByCategory(reveals: RevealModel[]) {
        setRevealsByCategory(reveals);
    }

    function RandomRevealFromUser(revealsByCategory: RevealModel[]): RevealModel | null {
        if (revealsByCategory.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * revealsByCategory.length);
        return revealsByCategory[randomIndex];
    }

    function handleStartGameWithUserCategory() {
        const Reveal = RandomRevealFromUser(revealsByCategory);
        if (Reveal) {
            setGameRevealByUser(Reveal);
            setShowPreviewMode(false);
            setRandomCategorySelected(false);
            setGameFinished(false);
        }
    }

    function handleStartNewGameWithRandomCategory() {
        const allReveals = props.activeReveals;
        if (!allReveals || allReveals.length === 0) return;

        let newReveal;
        do {
            newReveal = allReveals[Math.floor(Math.random() * allReveals.length)];
        } while (newReveal.id === gameRevealByUser?.id && allReveals.length > 1);

        setRevealedTiles([]);
        setShowFullImage(false);

        // Verzögere das Setzen des neuen Bildes
        setTimeout(() => {
            setGameRevealByUser(newReveal); // Setze das neue Bild nach einer kleinen Verzögerung
            setGameFinished(false);
            setShowPreviewMode(false);
            setShowNameInput(false);
            setRandomCategorySelected(true);
            setTime(0);
            setNumberOfClicks(0);
            setRevealedTiles([]);
            setShowSolutionWords(false);
            setShowFullImage(false);
        }, 200); // 100ms Verzögerung (kann je nach Bedarf angepasst werden)
    }

    function handleResetGame(){
        setShowPreviewMode(true);
        setGameFinished(true);
        setGameRevealByUser(null);
        setRevealsByCategory([]);
        setSelectedCategory(null);
        setRandomCategorySelected(false);
        setTime(0);
        setNumberOfClicks(0);
        setRevealedTiles([]);
        setShowSolutionWords(false);
        setShowFullImage(false);
    }

    function toggleGameMode(){
        setGameMode(prevState =>
        prevState === "REVEAL_WITH_CLICKS" ? "REVEAL_OVER_TIME" : "REVEAL_WITH_CLICKS")
    }


    // Timer starten, wenn das Spiel beginnt
    useEffect(() => {
        if (!showPreviewMode && !gameFinished) {
            setTime(0);
            const id = window.setInterval(() => {
                setTime((prev) => prev + 0.1);
            }, 100);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [showPreviewMode, gameFinished]);


    function revealRandomField() {
        const hiddenFields = Array.from({ length: totalTiles }, (_, index) => index).filter(
            (index) => !revealedTiles.includes(index)
        );

        if (hiddenFields.length > 0) {
            const randomIndex = hiddenFields[Math.floor(Math.random() * hiddenFields.length)];
            setRevealedTiles((prevTiles) => [...prevTiles, randomIndex]);
        }
    }

    function handleRevealMoreButton() {
        setNumberOfClicks((prevClicks) => prevClicks + 1);
        revealRandomField();
    }

    useEffect(() => {
        if (gameMode === "REVEAL_OVER_TIME" && !showPreviewMode && !gameFinished) {
            const interval = setInterval(() => {
                revealRandomField();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [gameMode, showPreviewMode, revealedTiles, gameFinished]);

    useEffect(() => {
        props.getActiveReveals();
    }, []);

    return (
        <div>
            <div className="space-between">
                {showPreviewMode && <button onClick={handleStartGameWithUserCategory} id={!showPreviewMode ? "inactive-button" : revealsByCategory.length > 0 ? "active-button" : "inactive-button"} disabled={!showPreviewMode}>Start Game</button>}

                {!gameFinished && !showPreviewMode && gameMode === "REVEAL_WITH_CLICKS" && numberOfClicks < 36 && <button onClick={handleRevealMoreButton} className="button-group-button" id="button-border-animation">Reveal More</button>}

                {gameFinished && !showPreviewMode && <button onClick={handleStartNewGameWithRandomCategory} className="button-group-button" id="button-border-animation">Play Again (rnd-cat)</button>}

                <button
                    onClick={gameFinished ? toggleGameMode : undefined}
                    className={gameMode === "REVEAL_WITH_CLICKS" ? "button-with-clicks" : "button-over-time"}
                    disabled={!gameFinished}
                >
                    {gameMode === "REVEAL_WITH_CLICKS" ? "Gamemode: 🔘 With Clicks" : "Gamemode: ⏳ Over Time"}
                </button>


                {!(gameFinished) && (
                    (numberOfClicks >= 36 || (gameMode === "REVEAL_OVER_TIME" && revealedTiles.length === totalTiles)) && (
                        <button className="button-group-button" id="button-border-animation" onClick={() => setShowSolutionWords(true)}>
                            Show Solution
                        </button>
                    )
                )}

                <button onClick={() => {handleResetGame()}} className="button-group-button">Reset</button>

                <div>{gameMode === "REVEAL_OVER_TIME" ? `⏱️ Time: ${time.toFixed(1)} sec` : ""}</div>
                <div>{gameMode === "REVEAL_WITH_CLICKS" ? `🔘 Clicks: ${numberOfClicks}` : ""}</div>
            </div>

            {showSolutionWords &&
                <div className="solution-container">
                    <div className="solution-word" id="solution-word-header">
                Solution-Words:
                    </div>
                    {gameRevealByUser?.solutionWords.map((word, index) => (<div className="solution-word" key={index}>{word}</div>))}
                </div>
            }

            {showPreviewMode && <PreviewPlay selectedRevealsByCategory={selectedRevealsByCategory} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} randomCategorySelected={randomCategorySelected} setRandomCategorySelected={setRandomCategorySelected}/>}

            {!showPreviewMode && gameRevealByUser && <StartGame user={props.user} gameRevealByUser={gameRevealByUser} gameMode={gameMode} revealedTiles={revealedTiles} handleResetGame={handleResetGame} highScoresOverTime={props.highScoresOverTime} highScoresWithClicks={props.highScoresWithClicks} getHighScoresOverTime={props.getHighScoresOverTime} getHighScoresWithClicks={props.getHighScoresWithClicks} gameFinished={gameFinished} setGameFinished={setGameFinished} time={time} numberOfClicks={numberOfClicks} showPreviewMode={showPreviewMode} setShowPreviewMode={setShowPreviewMode} setShowSolutionWords={setShowSolutionWords} showNameInput={showNameInput} setShowNameInput={setShowNameInput} showFullImage={showFullImage} setShowFullImage={setShowFullImage} />}
        </div>
    );
}


