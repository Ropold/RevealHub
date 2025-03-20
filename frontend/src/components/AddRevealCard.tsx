import { RevealModel } from "./model/RevealModel.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/AddRevealCard.css"
import "./styles/Popup.css"

type AddRevealCardProps = {
    user: string;
    handleNewRevealSubmit: (reveal: RevealModel) => void;
};

export default function AddRevealCard(props: Readonly<AddRevealCardProps>) {
    const [name, setName] = useState<string>("");
    const [solutionWords, setSolutionWords] = useState<string[]>([""]);
    const [closeSolutionWords, setCloseSolutionWords] = useState<string[]>([""]);
    const [category, setCategory] = useState<string | null>(null);
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Entfernen von leeren Strings aus den solutionWords und closeSolutionWords
        const cleanedSolutionWords = solutionWords.filter(word => word.trim() !== "");
        const cleanedCloseSolutionWords = closeSolutionWords.filter(word => word.trim() !== "");

        const revealData = {
            name,
            solutionWords: cleanedSolutionWords.length > 0 ? cleanedSolutionWords : [],
            closeSolutionWords: cleanedCloseSolutionWords.length > 0 ? cleanedCloseSolutionWords : [],
            category,
            description,
            isActive: true,
            githubId: props.user,
            imageUrl: imageUrl,
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("revealModelDto", new Blob([JSON.stringify(revealData)], { type: "application/json" }));

        axios
            .post("/api/reveal-hub", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Reveal saved:", response.data);
                navigate(`/reveal/${response.data.id}`);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400 && error.response.data) {
                    const errorMessages = error.response.data;
                    const errors: string[] = [];
                    Object.keys(errorMessages).forEach((field) => {
                        errors.push(`${field}: ${errorMessages[field]}`);
                    });

                    setErrorMessages(errors);
                    setShowPopup(true);
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
            setImageUrl("temp-image");
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setErrorMessages([]);
    };

    const handleAddSolutionWord = () => {
        if (solutionWords) {
            setSolutionWords([...solutionWords, ""]);
        }
    };

    const handleAddCloseSolutionWord = () => {
        if (closeSolutionWords) {
            setCloseSolutionWords([...closeSolutionWords, ""]);
        }
    };

    const handleSolutionWordChange = (index: number, value: string) => {
        const newSolutionWords = [...solutionWords];
        newSolutionWords[index] = value;
        setSolutionWords(newSolutionWords);
    };

    const handleCloseSolutionWordChange = (index: number, value: string) => {
        const newCloseSolutionWords = [...closeSolutionWords];
        newCloseSolutionWords[index] = value;
        setCloseSolutionWords(newCloseSolutionWords);
    };

    return (
        <>
            <div className="edit-form">
                <h2>Add Reveal Card</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            className="input-small"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <label>
                        Category:
                        <select
                            className="input-small"
                            value={category || ""}
                            onChange={(e) => setCategory(e.target.value || null)}
                        >
                            <option value="">Please select a Category</option>
                            <option value="ANIMAL">Animal</option>
                            <option value="CITY">City</option>
                            <option value="BUILDING">Building</option>
                            <option value="FOOD">Food</option>
                            <option value="TOOL">Tool</option>
                            <option value="SPORT">Sport</option>
                            <option value="MOVIE">Movie</option>
                            <option value="GAME">Game</option>
                            <option value="CARTOON">Cartoon</option>
                        </select>
                    </label>

                    {/* solutionWords */}
                    <label className="label-solution-words">
                        Solution Words:
                        {solutionWords.map((word, index) => (
                            <input
                                key={index}
                                className="input-small"
                                type="text"
                                value={word}
                                onChange={(e) => handleSolutionWordChange(index, e.target.value)}
                            />
                        ))}
                        <button type="button" className="solution-words-button" onClick={handleAddSolutionWord}>
                            Add More Solution Words
                        </button>
                    </label>

                    {/* closeSolutionWords */}
                    <label className="label-solution-words">
                        Close Solution Words:
                        {closeSolutionWords.map((word, index) => (
                            <input
                                key={index}
                                className="input-small"
                                type="text"
                                value={word}
                                onChange={(e) => handleCloseSolutionWordChange(index, e.target.value)}
                            />
                        ))}
                        <button type="button" className="solution-words-button" onClick={handleAddCloseSolutionWord}>
                            Add More Close Solution Words
                        </button>
                    </label>

                    <label>
                        Description:
                        <textarea
                            className="textarea-large"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    <label>
                        Image:
                        <input
                            type="file"
                            onChange={onFileChange}
                        />
                    </label>

                    {image && (
                        <img src={URL.createObjectURL(image)} className="memory-card-image" alt="Preview" />
                    )}

                    <div className="space-between">
                        <button className="button-group-button" type="submit">Add Memory Card</button>
                    </div>
                </form>

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Validation Errors</h3>
                            <ul>
                                {errorMessages.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                            <div className="popup-actions">
                                <button className="popup-cancel" onClick={handleClosePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
