import {RevealModel} from "./model/RevealModel.ts";

type StartGameProps = {
    revealFromUser: RevealModel;
}

export default function StartGame(props: Readonly<StartGameProps>){
    return (
        <>
            <div>
                <h2>Game started</h2>
                <p>{props.revealFromUser.name}</p>
            </div>
        </>
    )
}