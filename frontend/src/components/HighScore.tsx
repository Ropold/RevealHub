import {HighScoreModel} from "./model/HighScoreModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import "./styles/HighScore.css";
import {getGameModeDisplayName} from "./utils/getGameModeDisplayName.ts";
import {getCategoryDisplayName} from "./utils/getCategoryDisplayName.ts";

type HighScoreProps = {
    highScoresOverTime: HighScoreModel[];
    highScoresWithClicks: HighScoreModel[];
    getHighScoresOverTime: () => void;
    getHighScoresWithClicks: () => void;
}

const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
};

export default function HighScore(props: Readonly<HighScoreProps>) {
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [githubUsernames, setGithubUsernames] = useState<Map<string, string>>(new Map());

    function fetchGithubUsernames(highScores: HighScoreModel[]) {
        const uniqueIds = new Set(
            highScores
                .filter(score => score.githubId !== "anonymousUser")
                .map(score => score.githubId)
        );

        const newUsernames = new Map(githubUsernames);

        uniqueIds.forEach(async (id) => {
            if (!newUsernames.has(id)) {
                axios.get(`https://api.github.com/user/${id}`)
                    .then((response) => {
                        newUsernames.set(id, response.data.login);
                        setGithubUsernames(new Map(newUsernames));
                    })
                    .catch((error) => {
                        console.error(`Error fetching GitHub user ${id}:`, error);
                    });
            }
        });
    }

    useEffect(() => {
        fetchGithubUsernames([...props.highScoresOverTime, ...props.highScoresWithClicks]);
    }, [props.highScoresOverTime, props.highScoresWithClicks]);

    useEffect(() => {
        props.getHighScoresOverTime();
        props.getHighScoresWithClicks();
    }, []);

    const handleTableSelect = (tableId: string) => {
        setSelectedTable(tableId);
    };

    const handleBack = () => {
        setSelectedTable(null);
    };

    const renderCompressedTable = (highScores: HighScoreModel[], cardType: string) => (
        <div className="high-score-table-compressed" onClick={() => handleTableSelect(cardType)}>
            <h3 className="high-score-table-compressed-h3">{cardType} High-Score</h3>
            <table>
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Clicks</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {highScores.map((highScore, index) => (
                    <tr key={highScore.id}>
                        <td>{index + 1}</td>
                        <td>{highScore.playerName}</td>
                        <td>{highScore.numberOfClicks}</td>
                        <td>{highScore.scoreTime}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const renderDetailedTable = (highScores: HighScoreModel[], cardType: string, isSelected: boolean) => {
        if (!isSelected) return null; // Only render the selected table

        return (
            <div className="high-score-table">
                <h3 className="high-score-table-h3">{cardType} High-Score</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player-Name</th>
                        <th>Date</th>
                        <th>Game Mode</th>
                        <th>Category</th>
                        <th>Authentication</th>
                        <th>Clicks</th>
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {highScores.map((highScore, index) => (
                        <tr key={highScore.id}>
                            <td>{index + 1}</td>
                            <td>{highScore.playerName}</td>
                            <td>{formatDate(highScore.date)}</td>
                            <td>{getGameModeDisplayName(highScore.gameMode)}</td>
                            <td>{getCategoryDisplayName(highScore.category)}</td>
                            <td>
                                {highScore.githubId === "anonymousUser"
                                    ? "Anonymous"
                                    : `Github-User (${githubUsernames.get(highScore.githubId) || "Loading..."})`}
                            </td>
                            <td>{highScore.numberOfClicks}</td>
                            <td>{highScore.scoreTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <div className="high-score">

                {/* Highscore Tables */}
                <div className={selectedTable === null ? 'high-score-item-container-compressed' : 'high-score-item-container-detailed'}>
                    {selectedTable === null ? (
                        <>
                            {renderCompressedTable(props.highScoresOverTime, "OverTime")}
                            {renderCompressedTable(props.highScoresWithClicks, "WithClicks")}
                        </>
                    ) : (
                        <>
                            {renderDetailedTable(props.highScoresOverTime, "OverTime", selectedTable === "OverTime")}
                            {renderDetailedTable(props.highScoresWithClicks, "WithClicks", selectedTable === "WithClicks")}
                        </>
                    )}
                </div>
                {/* Show detailed view or compressed view */}
                {selectedTable !== null && (
                    <button onClick={handleBack} className="button-group-button">Back to Overview</button>
                )}
            </div>
        </>
    )
}