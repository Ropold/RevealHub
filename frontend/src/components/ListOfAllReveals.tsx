import {RevealModel} from "./model/RevealModel.ts";
import {useEffect} from "react";
import RevealCard from "./RevealCard.tsx";

type ListOfAllRevealsProps = {
    activeReveals: RevealModel[];
    getActiveReveals: () => void;
    favorites: string[];
    toggleFavorite: (revealId: string) => void;
    user: string;
}

export default function ListOfAllReveals(props: Readonly<ListOfAllRevealsProps>) {

    useEffect(() => {
        props.getActiveReveals()
    }, []);

    return (
        <>
            <div>
                <h2>List Of All Reveals</h2>
            </div>
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
        </>
    )
}