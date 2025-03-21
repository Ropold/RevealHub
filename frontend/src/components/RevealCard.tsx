import {RevealModel} from "./model/RevealModel.ts";
import {useNavigate} from "react-router-dom";
import "./styles/Buttons.css";
import "./styles/RevealCard.css"

type RevealCardProps = {
    reveal: RevealModel;
    user: string;
    favorites: string[];
    toggleFavorite: (revealId: string) => void;
}

export default function RevealCard(props: Readonly<RevealCardProps>) {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/reveal/${props.reveal.id}`);
    }

    const isFavorite = props.favorites.includes(props.reveal.id);

    return (
        <>
            <div className="reveal-card" onClick={handleCardClick}>
                <h3>{props.reveal.name}</h3>
                <img src={props.reveal.imageUrl} alt={props.reveal.name} className="reveal-card-image" />

                {props.user !== "anonymousUser" && (
                    <button
                        id="button-favorite-reveal-card"
                        onClick={(event) => {
                            event.stopPropagation(); // Verhindert die Weitergabe des Klicks an die Karte
                            props.toggleFavorite(props.reveal.id);
                        }}
                        className={isFavorite ? "favorite-on" : "favorite-off"}
                    >
                        ♥
                    </button>
                )}
            </div>
        </>
    )
}