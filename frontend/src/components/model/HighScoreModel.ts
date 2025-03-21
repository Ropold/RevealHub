import {Category} from "./Category.ts";
import {GameMode} from "./GameMode.ts";

export type HighScoreModel = {
    id: string;
    playerName: string;
    githubId: string;
    category: Category;
    gameMode: GameMode;
    scoreTime: number;
    numberOfClicks: number;
    date: string;
}