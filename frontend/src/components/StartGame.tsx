import {RevealModel} from "./model/RevealModel.ts";
import "./styles/GameStart.css"

type StartGameProps = {
    gameReveal: RevealModel;
}

export default function StartGame(props: Readonly<StartGameProps>){
    return (
        <>
            <div>
                <h2>Game started</h2>
                <p>{props.gameReveal.name}</p>
                <img className="reveal-pic" src={props.gameReveal.imageUrl} alt={props.gameReveal.name}/>
            </div>
        </>
    )
}