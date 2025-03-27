import PreviewPlay from "./PreviewPlay.tsx";
import { RevealModel } from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import StartGame from "./StartGame.tsx";
import {Category} from "./model/Category.ts";
import {GameMode} from "./model/GameMode.ts";
import "./styles/Play.css"

type PlayProps = {
    user: string;
};

export default function Play(props: Readonly<PlayProps>) {
    const [revealsByCategory, setRevealsByCategory] = useState<RevealModel[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [gameReveal, setGameReveal] = useState<RevealModel | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [randomCategorySelected, setRandomCategorySelected] = useState<boolean>(false);
    const [gameMode, setGameMode] = useState<GameMode>("REVEAL_WITH_CLICKS");
    const [showSolution, setShowSolution] = useState<boolean>(false);

    const [playerName, setPlayerName] = useState<string>("");
    const [numberOfClicks, setNumberOfClicks] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);

    const totalTiles = 36;
    const [revealedTiles, setRevealedTiles] = useState<number[]>([]);

    // const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    // const [showAnimation, setShowAnimation] = useState<boolean>(false);
    // const [showPopup, setShowPopup] = useState<boolean>(false);

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
            setGameStarted(true);
            setRandomCategorySelected(false);
            setGameFinished(false);
        }
    }

    function handleResetGame(){
        setGameStarted(false);
        setGameFinished(true);
        setGameReveal(null);
        setRevealsByCategory([]);
        setSelectedCategory(null);
        setRandomCategorySelected(false);
        setTime(0);
        setNumberOfClicks(0);
        setRevealedTiles([]);
        setShowSolution(false);
    }

    function toggleGameMode(){
        setGameMode(prevState =>
        prevState === "REVEAL_WITH_CLICKS" ? "REVEAL_OVER_TIME" : "REVEAL_WITH_CLICKS")
    }

    const postHighScore = () => {
        const highScoreData = {
            playerName,
            githubId: props.user,
            category: gameReveal?.category,
            gameMode: gameMode,
            scoreTime: parseFloat(time.toFixed(1)),
            numberOfClicks: numberOfClicks
        };
    }

    // Timer starten, wenn das Spiel beginnt
    useEffect(() => {
        if (gameStarted) {
            setTime(0);
            const id = window.setInterval(() => {
                setTime(prev => prev + 0.1);
            }, 100);
            setIntervalId(id);
        } else if (!gameStarted && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [gameStarted]);

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
        if (gameMode === "REVEAL_OVER_TIME" && gameStarted) {
            const interval = setInterval(() => {
                revealRandomField();
            }, 3000); // Alle 3 Sekunden

            return () => clearInterval(interval); // Cleanup
        }
    }, [gameMode, gameStarted, revealedTiles]);



    return (
        <div>
            <div className="space-between">
                {!gameStarted && <button onClick={handleStartGame} id={gameStarted ? "inactive-button" : revealsByCategory.length > 0 ? "active-button" : "inactive-button"} disabled={gameStarted}>Start Game</button>}

                {gameStarted && gameMode === "REVEAL_WITH_CLICKS" && numberOfClicks < 36 && <button onClick={handleRevealMoreButton} className="button-group-button" id="button-reveal-more">Reveal More</button>}

                <button onClick={!gameStarted ? toggleGameMode : undefined} className={gameMode === "REVEAL_WITH_CLICKS" ? "button-with-clicks" : "button-over-time"} disabled={gameStarted} id={gameStarted ? "disabled-button" : ""}>{gameMode === "REVEAL_WITH_CLICKS" ? "Gamemode: 🔘 With Clicks" : "Gamemode: ⏳ Over Time"}</button>

                {(numberOfClicks >= 36 || (gameMode === "REVEAL_OVER_TIME" && revealedTiles.length === totalTiles)) && (
                    <button className="button-group-button" id="button-reveal-more" onClick={() => setShowSolution(true)}>
                        Show Solution
                    </button>
                )}


                <button onClick={() => {handleResetGame()}} className="button-group-button">Reset</button>

                <div>{gameMode === "REVEAL_OVER_TIME" ? `⏱️ Time: ${time.toFixed(1)} sec` : ""}</div>
                <div>{gameMode === "REVEAL_WITH_CLICKS" ? `🔘 Clicks: ${numberOfClicks}` : ""}</div>
            </div>

            {showSolution && <div className="solution-container">{gameReveal?.solutionWords.map((word, index) => (<div className="solution-word" key={index}>{word}</div>))}</div>}

            {!gameStarted && <PreviewPlay selectedRevealsByCategory={selectedRevealsByCategory} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} randomCategorySelected={randomCategorySelected} setRandomCategorySelected={setRandomCategorySelected}/>}

            {gameStarted && gameReveal && <StartGame gameReveal={gameReveal} gameMode={gameMode} revealedTiles={revealedTiles} handleResetGame={handleResetGame}/>}
        </div>
    );
}


