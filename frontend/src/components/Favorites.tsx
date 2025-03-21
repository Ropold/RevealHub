import {useEffect, useState} from "react";
import {RevealModel} from "./model/RevealModel.ts";
import axios from "axios";
import RevealCard from "./RevealCard.tsx";

type FavoritesProps = {
    favorites: string[];
    user: string;
    toggleFavorite: (memoryId: string) => void;
}

export default function Favorites(props: Readonly<FavoritesProps>) {
    const [favoritesReveals, setFavoritesReveals] = useState<RevealModel[]>([]);

    useEffect(() => {
        axios
            .get(`/api/reveal-hub/favorites`)
            .then((response) => {
                setFavoritesReveals(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.user, props.favorites]);

    return (
        <>
            <h2>Favorites</h2>
            <div className="reveal-card-container">
                {favoritesReveals.length > 0 ? (
                    favoritesReveals.map((r) => (  // ← Korrekte Syntax mit `r`
                        <RevealCard
                            key={r.id}
                            reveal={r}
                            user={props.user}
                            favorites={props.favorites}
                            toggleFavorite={props.toggleFavorite}
                        />
                    ))
                ) : (
                    <p>No Reveals in favorites.</p>
                )}
            </div>
        </>
    );
}
