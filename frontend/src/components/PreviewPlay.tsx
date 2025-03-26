import {useEffect, useState} from "react";
import axios from "axios";
import {RevealModel} from "./model/RevealModel.ts";
import {ALL_CATEGORIES, Category} from "./model/Category.ts";
import { getCategoryDisplayName } from "./utils/getCategoryDisplayName.ts";
import "./styles/PreviewPlay.css"
import randomPic from "../assets/categories/random.jpg";
import {categoryImages} from "./utils/CategoryImages.ts";

type PreviewPlayProps = {
    selectedRevealsByCategory: (reveals: RevealModel[]) => void;
}

export default function PreviewPlay(props: Readonly<PreviewPlayProps>){
    const [activeCategories, setActiveCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
    const [randomCategorySelected, setRandomCategorySelected] = useState<boolean>(false);

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
                props.selectedRevealsByCategory(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function selectRandomCategory() {
        if (activeCategories.length > 0) {
            const randomIndex = Math.floor(Math.random() * activeCategories.length);
            setSelectedCategory(activeCategories[randomIndex]);
        }
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
            {(selectedCategory || randomCategorySelected) && (
                <h3>
                    Selected Category: <strong className="selected-category">{randomCategorySelected ? "Random" : selectedCategory ? getCategoryDisplayName(selectedCategory) : ""}</strong>
                </h3>
            )}

            <div className="category-images">
                <img
                    src={randomPic}
                    alt="Pick Random Category"
                    onClick={() => {
                        selectRandomCategory();
                        setRandomCategorySelected(true); // Setze den Zustand für Zufallskategorie
                    }}
                    className={`category-image-active ${randomCategorySelected ? "category-image-active-selected" : ""}`}
                />
                {ALL_CATEGORIES.map((category) => {
                    const isActive = activeCategories.includes(category);
                    return (
                        <img
                            key={category}
                            src={categoryImages[category]}
                            alt={getCategoryDisplayName(category)}
                            onClick={() => {
                                if (isActive) {
                                    setSelectedCategory(category);
                                    setRandomCategorySelected(false);
                                }
                            }}
                            className={`category-image ${isActive ? "category-image-active" : ""} ${selectedCategory === category && isActive && !randomCategorySelected ? "category-image-active-selected" : ""}`}
                        />
                    );
                })}
            </div>

        </div>
    );
}