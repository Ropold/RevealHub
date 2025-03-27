import PreviewPlay from "./PreviewPlay.tsx";
import { RevealModel } from "./model/RevealModel.ts";
import { useState } from "react";
import StartGame from "./StartGame.tsx";
import {Category} from "./model/Category.ts";
import {GameMode} from "./model/GameMode.ts";

type PlayProps = {
    user: string;
};

export default function Play(props: Readonly<PlayProps>) {
    const [revealsByCategory, setRevealsByCategory] = useState<RevealModel[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [randomReveal, setRandomReveal] = useState<RevealModel | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [randomCategorySelected, setRandomCategorySelected] = useState<boolean>(false);
    const [gameMode, setGameMode] = useState<GameMode>("REVEAL_WITH_CLICKS")


    // const [time, setTime] = useState<number>(0);
    // const [numberOfClicks, setNumberOfClicks] = useState<number>(0);
    // const [playerName, setPlayerName] = useState<string>("");
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
        const reveal = RandomRevealFromUser(revealsByCategory);
        if (reveal) {
            setRandomReveal(reveal);
            setGameStarted(true);
            setRandomCategorySelected(false);
        }
    }

    function handleResetGame(){
        setGameStarted(false);
        setRandomReveal(null);
        setRevealsByCategory([]);
        setSelectedCategory(null);
        setRandomCategorySelected(false);
    }

    function toggleGameMode(){
        setGameMode(prevState =>
        prevState === "REVEAL_WITH_CLICKS" ? "REVEAL_OVER_TIME" : "REVEAL_WITH_CLICKS")
    }

    return (
        <div>
            <p>{props.user}</p>
            <div className="space-between">
            <button onClick={handleStartGame} id={revealsByCategory.length === 0 ? "inactive-button" : "active-button"}>Start Game</button>
                <button onClick={toggleGameMode} className={gameMode === "REVEAL_WITH_CLICKS" ? "button-with-clicks" : "button-over-time"}>
                    {gameMode === "REVEAL_WITH_CLICKS" ? "Gamemode: 🖱 With Clicks" : "Gamemode: ⏳ Over Time"}
                </button>
                <button onClick={() => {handleResetGame()}} className="button-group-button">Reset</button>
            </div>
            {!gameStarted && <PreviewPlay selectedRevealsByCategory={selectedRevealsByCategory} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} randomCategorySelected={randomCategorySelected} setRandomCategorySelected={setRandomCategorySelected}/>}
            {gameStarted && randomReveal && <StartGame revealFromUser={randomReveal} />}
        </div>
    );
}
