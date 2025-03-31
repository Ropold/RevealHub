import {useNavigate} from "react-router-dom";
import axios from "axios";
import {UserDetails} from "./model/UserDetailsModel.ts";
import "./styles/Buttons.css"
import headerLogo from "../assets/Reveal-logo.png";

type NavbarProps = {
    userDetails: UserDetails | null;
    getUserDetails: () => void;
    user: string
    getUser: () => void
    setIsEditing: (isEditing: boolean) => void;
    setCurrentPage: (currentPage: number) => void;
}

export default function Navbar(props: Readonly<NavbarProps>) {
    const navigate = useNavigate();

    function loginWithGithub() {
        const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin;
        window.open(host + "/oauth2/authorization/github", "_self");
    }

    function logoutFromGithub() {
        axios
            .post("/api/users/logout")
            .then(() => {
                props.getUser();
                props.getUserDetails();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    return (
        <>
            <nav className="navbar">

                <button className="button-group-button" onClick={() => navigate("/")}>Home</button>
                <div
                    className="clickable-header"
                    id="clickable-header-play"
                    onClick={() => {
                        navigate("/play");
                    }}
                >
                    <h2 className="header-title">Play</h2>
                    <img src={headerLogo} alt="RevealHub Logo" className="logo-image" />
                </div>
                <div
                    className="clickable-header"
                    onClick={() => {
                        navigate("/list-of-all-reveals");
                        props.setCurrentPage(1);
                    }}
                >
                    <h2 className="header-title">Reveal Collection</h2>
                    <img src={headerLogo} alt="RevealHub Logo" className="logo-image" />
                </div>

                <button
                    id="button-high-score"
                    onClick={() => {
                        navigate("/high-score");
                    }}
                >
                    High-Score
                </button>

                {props.user !== "anonymousUser" ? (
                    <>
                        <button className="button-group-button" onClick={() => navigate(`/favorites`)}>Favorites</button>
                        <button className="button-group-button" onClick={() => navigate("/add")}>Add Reveal</button>
                        <button className="button-group-button" onClick={() => {navigate("/my-reveals"); props.setIsEditing(false)}}>My Reveals</button>
                        <button className="button-group-button" onClick={() => navigate("/profile")}>Profile</button>
                        <button className="button-group-button" onClick={logoutFromGithub}>Logout</button>
                    </>
                ) : (
                    <button className="button-group-button" onClick={loginWithGithub}>Login with GitHub</button>
                )}
            </nav>
        </>
    )
}