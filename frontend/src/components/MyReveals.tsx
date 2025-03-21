import {RevealModel} from "./model/RevealModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
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

    const [userReveals, setUserReveals] = useState<RevealModel[]>([]);
    const [editReveal, setEditReveal] = useState<RevealModel | null>(null);
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

            // Wenn der Raum ein Bild hat, setze es in den State
            if (revealToEdit.imageUrl) {
                fetch(revealToEdit.imageUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const file = new File([blob], "current-image.jpg", {type: blob.type});
                        setImage(file);
                    })
                    .catch((error) => console.error("Error loading current image:", error));
            } else {
                setImage(null);
            }
        }
    };

    // Handle form submission to save the changes
    const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editData) return;

        const data = new FormData();
        if (image) {
            data.append("image", image);
        }

        const updatedRevealData = {
            ...editData,
            imageUrl: "",  // You may want to update this after uploading the image
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
        <>
            <div>
                <h2>My Reveals</h2>

                {/* Popup für Löschbestätigung */}
                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Confirm Deletion</h3>
                            <p>Are you sure you want to delete this room?</p>
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
        </>
    )
}