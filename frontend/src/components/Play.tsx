import PreviewPlay from "./PreviewPlay.tsx";
import {RevealModel} from "./model/RevealModel.ts";
import {useState} from "react";
import StartGame from "./StartGame.tsx";

type PlayProps = {
    user: string;
}

export default function Play(props: Readonly<PlayProps>){
    const [revealsByCategory, setRevealsByCategory] = useState<RevealModel[]>([]);

    function selectedRevealsByCategory(reveals: RevealModel[]) {
        setRevealsByCategory(reveals);
    }

    return (
        <>
            <div>
                <h2>Play</h2>
                <p>{props.user}</p>
                <PreviewPlay selectedRevealsByCategory={selectedRevealsByCategory}/>
                <StartGame/>
            </div>
        </>
    )
}