import {useParams} from "react-router-dom";
import {DefaultReveal, RevealModel} from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {getCategoryDisplayName} from "./utils/getCategoryDisplayName.ts";
import {DefaultUserDetails, UserDetails} from "./model/UserDetailsModel.ts";

export default function Details() {
    const [reveal, setReveal] = useState<RevealModel>(DefaultReveal);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const { id } = useParams<{ id: string }>();

    const fetchRevealDetails=() => {
        if(!id)return
        axios
            .get(`/api/reveal-hub/${id}`)
            .then((response) => setReveal(response.data))
            .catch((error) => console.error("Error fetching reveal details", error));
    };

    useEffect(() => {
        fetchRevealDetails();
    }, [id]);

    const fetchGithubUsername = async () => {
        try {
            const response = await axios.get(`https://api.github.com/user/${reveal.githubId}`);
            setGithubUser(response.data);  // Setze den GitHub-Nutzer in den State
        } catch (error) {
            console.error('Fehler beim Abrufen des GitHub-Nutzers:', error);
        }
    };

    // useEffect für das Abrufen des GitHub-Nutzers, nur wenn githubId verfügbar ist
    useEffect(() => {
        if (reveal.githubId) {
            fetchGithubUsername();
        }
    }, [reveal.githubId]);

    return (
        <>
            <div className="reveal-details">
                <h2>{reveal.name}</h2>
                <p><strong>Solution Words:</strong> {reveal.solutionWords.join(", ")}</p>
                <p><strong>Close Solution Words:</strong> {reveal.closeSolutionWords.length > 0 ? reveal.closeSolutionWords.join(", ") : "None"}</p>
                <p><strong>Category:</strong> {getCategoryDisplayName(reveal.category)}{}</p>
                <p><strong>Description:</strong> {reveal.description || "No description available"}</p>
                <p><strong>Status:</strong> {reveal.isActive ? "Active" : "Inactive"}</p>
                <p><strong>Added by GitHub User:</strong> {reveal.githubId}</p>
                <img src={reveal.imageUrl} alt={reveal.name} style={{ maxWidth: "200px", height: "auto" }} />
            </div>
            <div className="profile-container">
                <h2>Added by User</h2>
                <p><strong>Github-User</strong> {githubUser.login} </p>
            </div>
        </>

    )
}