import {RevealModel} from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import RevealCard from "./RevealCard.tsx";
import {Category} from "./model/Category.ts";
import * as React from "react";

type MyRevealsProps = {
    allReveals: RevealModel[];
    getAllReveals: () => void;
    setAllReveals: React.Dispatch<React.SetStateAction<RevealModel[]>>;
    user: string;
    favorites: string[];
    toggleFavorite: (memoryId: string) => void;
}

export default function MyReveals(props: Readonly<MyRevealsProps>) {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editData, setEditData] = useState<RevealModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [revealToDelete, setRevealToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);


    const handleEditToggle = (revealId: string) => {
        const revealToEdit = props.allReveals.find((reveal) => reveal.id === revealId);
        if (revealToEdit) {
            setEditData(revealToEdit);
            setIsEditing(true);

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


    // Handle form submission to save the changes
    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editData) {
            return;
        }

        const data = new FormData();
        if (image) {
            data.append("image", image);
        }

        const updatedRevealData = {
            ...editData,
            imageUrl: image ? "temp-image" : editData.imageUrl, // Nur ersetzen, wenn ein neues Bild hochgeladen wurde
        };


        data.append("revealModelDto", new Blob([JSON.stringify(updatedRevealData)], {type: "application/json"}));

        axios
            .put(`/api/reveal-hub/${editData.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Antwort vom Server:", response.data);
                props.setAllReveals((prevReveals) =>
                    prevReveals.map((reveal) =>
                        reveal.id === editData.id ? {...reveal, ...response.data} : reveal
                    )
                );
                setIsEditing(false);  // Exit edit mode
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
            {isEditing ? (
                <div className="edit-form">
                    <h2>Edit Reveal</h2>
                    <form onSubmit={handleSaveEdit}>
                        <label>
                            Title:
                            <input
                                className="input-small"
                                type="text"
                                value={editData?.name || ""}
                                onChange={(e) => setEditData({...editData!, name: e.target.value})}
                            />
                        </label>

                        <label>
                            Description:
                            <textarea
                                className="textarea-large"
                                value={editData?.description || ""}
                                onChange={(e) => setEditData({...editData!, description: e.target.value})}
                            />
                        </label>

                        <label>
                            Category:
                            <select
                                className="input-small"
                                value={editData?.category || ""}
                                onChange={(e) => setEditData({...editData!, category: e.target.value as Category})}
                            >
                                {(["ANIMAL", "ART", "BUILDING", "CARTOON", "COOKING", "CITY", "CLOTHING", "COUNTRY", "FOOD", "GAME", "INSTRUMENT", "MOVIE", "MUSIC", "PERSON", "PLANT", "SPORTS", "TOOL", "VEHICLE"] as Category[])
                                    .map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                            </select>
                        </label>

                        <label>
                            Visibility:
                            <select
                                className="input-small"
                                value={editData?.isActive ? "true" : "false"}
                                onChange={(e) => setEditData({...editData!, isActive: e.target.value === "true"})}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </label>

                        <label>
                            Image:
                            <input type="file" onChange={onFileChange}/>
                            {image && <img src={URL.createObjectURL(image)} className="reveal-card-image"/>}
                        </label>

                        <div className="button-group">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
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
                                <div className="button-group">
                                    <button
                                        id={r.isActive ? "active-button" : "inactive-button"}
                                        onClick={() => handleEditToggle(r.id)}
                                    >
                                        {r.isActive ? "Active" : "Inactive"}
                                    </button>
                                    <button onClick={() => handleEditToggle(r.id)}>Edit</button>
                                    <button id="button-delete" onClick={() => handleDeleteClick(r.id)}>Delete</button>
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