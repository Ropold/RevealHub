import {RevealModel} from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import RevealCard from "./RevealCard.tsx";
import * as React from "react";
import "./styles/Buttons.css"
import "./styles/RevealCard.css"
import { Category, ALL_CATEGORIES } from "./model/Category.ts";
import { getCategoryDisplayName } from "./utils/getCategoryDisplayName.ts";

type MyRevealsProps = {
    allReveals: RevealModel[];
    getAllReveals: () => void;
    setAllReveals: React.Dispatch<React.SetStateAction<RevealModel[]>>;
    user: string;
    favorites: string[];
    toggleFavorite: (memoryId: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MyReveals(props: Readonly<MyRevealsProps>) {

    const [editData, setEditData] = useState<RevealModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [revealToDelete, setRevealToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);


    const handleEditToggle = (revealId: string) => {
        const revealToEdit = props.allReveals.find((reveal) => reveal.id === revealId);
        if (revealToEdit) {
            setEditData(revealToEdit);
            props.setIsEditing(true);

            // Hier nehmen wir einfach an, dass immer ein Bild vorhanden ist, wenn imageUrl gesetzt ist
            fetch(revealToEdit.imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const file = new File([blob], "current-image.jpg", { type: blob.type });
                    setImage(file);
                })
                .catch((error) => console.error("Error loading current image:", error));
        }
    };

    const handleToggleActiveStatus = (memoryId: string) => {
        axios
            .put(`/api/reveal-hub/${memoryId}/toggle-active`)
            .then(() => {
                props.setAllReveals((prevReveals) =>
                    prevReveals.map((r) =>
                        r.id === memoryId ? { ...r, isActive: !r.isActive } : r
                    )
                );
            })
            .catch((error) => {
                console.error("Error during Toggle Offline/Active", error);
                alert("An Error while changing the status of Active/Offline.");
            });
    };

    // Handle form submission to save the changes
    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editData) {
            return;
        }

        const cleanedSolutionWords = editData.solutionWords.filter(word => word.trim() !== "");
        const cleanedCloseSolutionWords = editData.closeSolutionWords.filter(word => word.trim() !== "");

        const updatedRevealData = {
            ...editData,
            solutionWords: cleanedSolutionWords,
            closeSolutionWords: cleanedCloseSolutionWords,
            imageUrl: image ? "temp-image" : editData.imageUrl, // Nur ersetzen, wenn ein neues Bild hochgeladen wurde
        };

        const data = new FormData();
        if (image) {
            data.append("image", image);
        }

        data.append("revealModelDto", new Blob([JSON.stringify(updatedRevealData)], {type: "application/json"}));

        axios
            .put(`/api/reveal-hub/${editData.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.setAllReveals((prevReveals) =>
                    prevReveals.map((reveal) =>
                        reveal.id === editData.id ? {...reveal, ...response.data} : reveal
                    )
                );
                props.setIsEditing(false);
            })
            .catch((error) => {
                console.error("Error saving reveal edits:", error);
                alert("An unexpected error occurred. Please try again.");
            });
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSolutionWordChange = (index: number, value: string) => {
        if (editData) {
            const updatedSolutionWords = [...editData.solutionWords];
            updatedSolutionWords[index] = value;
            setEditData({ ...editData, solutionWords: updatedSolutionWords });
        }
    };

    const handleAddSolutionWord = () => {
        if (editData) {
            setEditData({
                ...editData,
                solutionWords: [...editData.solutionWords, ""],
            });
        }
    };

    const handleCloseSolutionWordChange = (index: number, value: string) => {
        if (editData) {
            const updatedCloseSolutionWords = [...editData.closeSolutionWords];
            updatedCloseSolutionWords[index] = value;
            setEditData({ ...editData, closeSolutionWords: updatedCloseSolutionWords });
        }
    };

    const handleAddCloseSolutionWord = () => {
        if (editData) {
            setEditData({
                ...editData,
                closeSolutionWords: [...editData.closeSolutionWords, ""],
            });
        }
    };

    const handleDeleteClick = (id: string) => {
        setRevealToDelete(id);
        setShowPopup(true);
    };

    const handleCancel = () => {
        setRevealToDelete(null);
        setShowPopup(false);
    };

    const handleConfirmDelete = () => {
        if (revealToDelete) {
            axios
                .delete(`/api/reveal-hub/${revealToDelete}`)
                .then(() => {
                    props.setAllReveals((prevReveals) => prevReveals.filter((reveal) => reveal.id !== revealToDelete));
                })
                .catch((error) => {
                    console.error("Error deleting room:", error);
                    alert("An error occurred while deleting the room.");
                });
        }
        setShowPopup(false);
        setRevealToDelete(null);
    };

    useEffect(() => {
        props.getAllReveals()
    }, []);

    return (
        <div>
            {props.isEditing ? (
                <div className="edit-form">
                    <h2>Edit Reveal</h2>
                    <form onSubmit={handleSaveEdit}>
                        <label>
                            Title:
                            <input
                                className="input-small"
                                type="text"
                                value={editData?.name || ""}
                                onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                            />
                        </label>

                        <label>
                            Description:
                            <textarea
                                className="textarea-large"
                                value={editData?.description || ""}
                                onChange={(e) => setEditData({ ...editData!, description: e.target.value })}
                            />
                        </label>

                        <label>
                            Category:
                            <select
                                className="input-small"
                                value={editData?.category || ""}
                                onChange={(e) => setEditData({ ...editData!, category: e.target.value as Category })}
                            >
                                {ALL_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {getCategoryDisplayName(cat)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Visibility:
                            <select
                                className="input-small"
                                value={editData?.isActive ? "true" : "false"}
                                onChange={(e) => setEditData({ ...editData!, isActive: e.target.value === "true" })}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </label>

                        {/* solutionWords */}
                        <label>
                            Solution Words:
                            {editData?.solutionWords.map((word, index) => (
                                <input
                                    key={index}
                                    className="input-small"
                                    type="text"
                                    value={word}
                                    onChange={(e) => handleSolutionWordChange(index, e.target.value)}
                                />
                            ))}
                            <button type="button" className="solution-words-button more-space" onClick={handleAddSolutionWord}>
                                Extend Words
                            </button>
                        </label>

                        {/* closeSolutionWords */}
                        <div>
                            <label className="more-space">Close Solution Words:</label>
                            {editData?.closeSolutionWords.map((word, index) => (
                                <input
                                    key={index}
                                    className="input-small"
                                    type="text"
                                    value={word}
                                    onChange={(e) => handleCloseSolutionWordChange(index, e.target.value)}
                                />
                            ))}
                            <br /> {/* Zeilenumbruch hinzufügen */}
                            <button className="solution-words-button more-space" type="button" onClick={handleAddCloseSolutionWord}>
                                Extend Close-Words
                            </button>
                        </div>


                        <label>
                            Image:
                            <input type="file" onChange={onFileChange} />
                            {image && <img src={URL.createObjectURL(image)} alt={editData?.name || "Image"} className="reveal-card-image" />}
                        </label>

                        <div className="space-between">
                            <button className="button-group-button" type="submit">
                                Save Changes
                            </button>
                            <button className="button-group-button" type="button" onClick={() => props.setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="reveal-card-container">
                    {props.allReveals.length > 0 ? (
                        props.allReveals.map((r) => (
                            <div key={r.id}>
                                <RevealCard
                                    reveal={r}
                                    user={props.user}
                                    favorites={props.favorites}
                                    toggleFavorite={props.toggleFavorite}
                                />
                                <div className="space-between">
                                    <button
                                        id={r.isActive ? "active-button-my-reveals" : "inactive-button"}
                                        onClick={() => handleToggleActiveStatus(r.id)}
                                    >
                                        {r.isActive ? "Active" : "Inactive"}
                                    </button>
                                    <button className="button-group-button" onClick={() => handleEditToggle(r.id)}>
                                        Edit
                                    </button>
                                    <button id="button-delete" onClick={() => handleDeleteClick(r.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reveals found for this user.</p>
                    )}
                </div>
            )}

            {/* Popup für Löschbestätigung */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this reveal?</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">
                                Yes, Delete
                            </button>
                            <button onClick={handleCancel} className="popup-cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}