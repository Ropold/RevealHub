import {useParams} from "react-router-dom";
import {RevealModel} from "./model/RevealModel.ts";
import {DefaultReveal} from "./model/DefaultReveal.ts";
import {useEffect, useState} from "react";
import axios from "axios";

type DetailsProps = {
    user: string;
}

export default function Details(props: DetailsProps) {
    const[reveal, setReveal] = useState<RevealModel>(DefaultReveal);
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

    return (
        <>
            <div className="reveal-details">
                <h2>{reveal.name}</h2>
                <p><strong>Solution Words:</strong> {reveal.solutionWords.join(", ")}</p>
                <p><strong>Close Solution Words:</strong> {reveal.closeSolutionWords.length > 0 ? reveal.closeSolutionWords.join(", ") : "None"}</p>
                <p><strong>Category:</strong> {reveal.category}</p>
                <p><strong>Description:</strong> {reveal.description || "No description available"}</p>
                <p><strong>Status:</strong> {reveal.isActive ? "Active" : "Inactive"}</p>
                <p><strong>Added by GitHub User:</strong> {reveal.githubId}</p>
                <img src={reveal.imageUrl} alt={reveal.name} style={{ maxWidth: "200px", height: "auto" }} />
            </div>
            <p><strong>Later to user pros-user:</strong> {props.user}</p>
        </>

    )
}