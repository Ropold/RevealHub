import PreviewPlay from "./PreviewPlay.tsx";

type PlayProps = {
    user: string;
}

export default function Play(props: Readonly<PlayProps>){


    return (
        <>
            <div>
                <h2>Play</h2>
                <p>{props.user}</p>
                <PreviewPlay/>
            </div>
        </>
    )
}