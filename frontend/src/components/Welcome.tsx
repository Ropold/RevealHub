import welcomePic from "../assets/Reveal-pic.jpg"
import {useNavigate} from "react-router-dom";
import "./styles/Welcome.css"


export default function Welcome(){
    const navigate = useNavigate();

    return (
        <>
            <div>
                <h2>Welcome to RevealHub</h2>
                <p>Click on the Picture or the Play button to start playing!</p>
                <img
                    src={welcomePic}
                    alt="Welcome to RevealHub"
                    className="logo-welcome"
                    onClick={() => navigate("/play")}
                />
            </div>
        </>
    )
}