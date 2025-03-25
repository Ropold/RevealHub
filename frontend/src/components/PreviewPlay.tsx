import {useEffect, useState} from "react";
import axios from "axios";
import {RevealModel} from "./model/RevealModel.ts";
import { Category } from "./model/Category.ts";
import { getCategoryDisplayName } from "./utils/getCategoryDisplayName.ts";
import "./styles/PreviewPlay.css"
import welcomePic from "../assets/Reveal-pic.jpg"



export default function PreviewPlay(){
    const [activeCategories, setActiveCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
    const [revealsByCategory, setRevealsByCategory] = useState<RevealModel[]>([]);


    function getActiveCategories(){
        axios.get("/api/reveal-hub/active/categories")
            .then((response) => {
                setActiveCategories(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getRevealsByCategory(category: Category){
        axios.get(`/api/reveal-hub/active/category/${category}`)
            .then((response) => {
                setRevealsByCategory(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (selectedCategory) {
            getRevealsByCategory(selectedCategory);
        }
    }, [selectedCategory]);


    useEffect(() => {
        getActiveCategories()
    }, []);


    return (
        <div className="preview-play">
            <h2>Preview Play</h2>
            <p>Select a Category</p>
            <div className="category-images">
                {activeCategories.length > 0 ? (
                    activeCategories.map((category) => (
                        <img
                            key={category}
                            src={welcomePic}
                            alt={getCategoryDisplayName(category)}
                            onClick={() => setSelectedCategory(category)}
                            className={`category-image${selectedCategory === category ? "-active" : ""}`}
                        />
                    ))
                ) : (
                    <p>Loading categories...</p>
                )}
            </div>
            {selectedCategory && <p className="selected-category">Selected Category: {getCategoryDisplayName(selectedCategory)}</p>}
        </div>
    );
}