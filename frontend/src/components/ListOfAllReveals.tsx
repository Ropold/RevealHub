import {RevealModel} from "./model/RevealModel.ts";
import {useEffect} from "react";

type ListOfAllRevealsProps = {
    activeReveals: RevealModel[];
    getActiveReveals: () => void;
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
        </>
    )
}