import {RevealModel} from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import RevealCard from "./RevealCard.tsx";

type ListOfAllRevealsProps = {
    activeReveals: RevealModel[];
    getActiveReveals: () => void;
    favorites: string[];
    toggleFavorite: (revealId: string) => void;
    user: string;
}

export default function ListOfAllReveals(props: Readonly<ListOfAllRevealsProps>) {
    const [isSpoiler, setIsSpoiler] = useState<boolean>(false);

    useEffect(() => {
        props.getActiveReveals()
    }, []);

    return (
        <>
            <div>
                <h2>List Of All Reveals - Don't Spoiler yourself!</h2>
                {!isSpoiler && <button className="button-group-button" onClick={() => setIsSpoiler(true)}>I don't care - show me</button>}
                {isSpoiler && <button className="button-group-button" onClick={() => setIsSpoiler(false)}>Hide all Reveals</button>}
            </div>
            {isSpoiler && (
            <div className="reveal-card-container">
                {props.activeReveals.map((r) => (
                    <RevealCard
                        key={r.id}
                        reveal={r}
                        user={props.user}
                        favorites={props.favorites}
                        toggleFavorite={props.toggleFavorite}
                    />
                ))}
            </div>
            )}
        </>
    )
}