import {GameMode} from "../model/GameMode.ts";

export function getGameModeDisplayName(gameMode: GameMode): string {
    const gameModeDisplayNames: Record<GameMode, string> = {
        REVEAL_OVER_TIME: "Reveal Over Time",
        REVEAL_WITH_CLICKS: "Reveal With Clicks",
    };
    return gameModeDisplayNames[gameMode];
}