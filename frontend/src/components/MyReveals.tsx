import {RevealModel} from "./model/RevealModel.ts";
import {useEffect} from "react";

type MyRevealsProps = {
    allReveals: RevealModel[];
    getAllReveals: () => void;
}

export default function MyReveals(props: Readonly<MyRevealsProps>) {

    useEffect(() => {
        props.getAllReveals()
    }, []);

    return (
        <>
            <div>
                <h2>My Reveals</h2>
            </div>
        </>
    )
}