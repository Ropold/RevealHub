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
};

export default function Play(props: Readonly<PlayProps>) {
    const [revealsByCategory, setRevealsByCategory] = useState<RevealModel[]>([]);
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(false);
    const [gameFinished, setGameFinished] = useState<boolean>(false);
    const [gameReveal, setGameReveal] = useState<RevealModel | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [randomCategorySelected, setRandomCategorySelected] = useState<boolean>(false);
    const [gameMode, setGameMode] = useState<GameMode>("REVEAL_WITH_CLICKS");
    const [showSolutionWords, setShowSolutionWords] = useState<boolean>(false);

    const [numberOfClicks, setNumberOfClicks] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const totalTiles = 36;
    const [revealedTiles, setRevealedTiles] = useState<number[]>([]);


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


    function handleStartGame() {
        const Reveal = RandomRevealFromUser(revealsByCategory);
        if (Reveal) {
            setGameReveal(Reveal);
            setShowPreviewMode(true);
            setRandomCategorySelected(false);
            setGameFinished(false);
        }
    }

    function handleResetGame(){
        setShowPreviewMode(false);
        setGameFinished(true);
        setGameReveal(null);
        setRevealsByCategory([]);
        setSelectedCategory(null);
        setRandomCategorySelected(false);
        setTime(0);
        setNumberOfClicks(0);
        setRevealedTiles([]);
        setShowSolutionWords(false);
    }

    function toggleGameMode(){
        setGameMode(prevState =>
        prevState === "REVEAL_WITH_CLICKS" ? "REVEAL_OVER_TIME" : "REVEAL_WITH_CLICKS")
    }


    // Timer starten, wenn das Spiel beginnt
    useEffect(() => {
        if (showPreviewMode) {
            setTime(0);
            const id = window.setInterval(() => {
                setTime(prev => prev + 0.1);
            }, 100);
            setIntervalId(id);
        } else if (!showPreviewMode && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [showPreviewMode]);

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
        if (gameMode === "REVEAL_OVER_TIME" && showPreviewMode) {
            const interval = setInterval(() => {
                revealRandomField();
            }, 3000); // Alle 3 Sekunden

            return () => clearInterval(interval); // Cleanup
        }
    }, [gameMode, showPreviewMode, revealedTiles]);



    return (
        <div>
            <div className="space-between">
                {!showPreviewMode && <button onClick={handleStartGame} id={showPreviewMode ? "inactive-button" : revealsByCategory.length > 0 ? "active-button" : "inactive-button"} disabled={showPreviewMode}>Start Game</button>}

                {!gameFinished && showPreviewMode && gameMode === "REVEAL_WITH_CLICKS" && numberOfClicks < 36 && <button onClick={handleRevealMoreButton} className="button-group-button" id="button-reveal-more">Reveal More</button>}

                <button onClick={!showPreviewMode ? toggleGameMode : undefined} className={gameMode === "REVEAL_WITH_CLICKS" ? "button-with-clicks" : "button-over-time"} disabled={showPreviewMode} id={showPreviewMode ? "disabled-button" : ""}>{gameMode === "REVEAL_WITH_CLICKS" ? "Gamemode: 🔘 With Clicks" : "Gamemode: ⏳ Over Time"}</button>

                {(numberOfClicks >= 36 || (gameMode === "REVEAL_OVER_TIME" && revealedTiles.length === totalTiles)) && (
                    <button className="button-group-button" id="button-reveal-more" onClick={() => setShowSolutionWords(true)}>
                        Show Solution
                    </button>
                )}


                <button onClick={() => {handleResetGame()}} className="button-group-button">Reset</button>

                <div>{gameMode === "REVEAL_OVER_TIME" ? `⏱️ Time: ${time.toFixed(1)} sec` : ""}</div>
                <div>{gameMode === "REVEAL_WITH_CLICKS" ? `🔘 Clicks: ${numberOfClicks}` : ""}</div>
            </div>

            {showSolutionWords &&
                <div className="solution-container">
                    <div className="solution-word-header">
                Solution-Words:
                    </div>
                    {gameReveal?.solutionWords.map((word, index) => (<div className="solution-word" key={index}>{word}</div>))}
                </div>
            }

            {!showPreviewMode && <PreviewPlay selectedRevealsByCategory={selectedRevealsByCategory} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} randomCategorySelected={randomCategorySelected} setRandomCategorySelected={setRandomCategorySelected}/>}

            {showPreviewMode && gameReveal && <StartGame user={props.user} gameReveal={gameReveal} gameMode={gameMode} revealedTiles={revealedTiles} handleResetGame={handleResetGame} highScoresOverTime={props.highScoresOverTime} highScoresWithClicks={props.highScoresWithClicks} getHighScoresOverTime={props.getHighScoresOverTime} getHighScoresWithClicks={props.getHighScoresWithClicks} gameFinished={gameFinished} setGameFinished={setGameFinished} time={time} numberOfClicks={numberOfClicks} showPreviewMode={showPreviewMode} setShowPreviewMode={setShowPreviewMode} setShowSolutionWords={setShowSolutionWords}/>}
        </div>
    );
}


