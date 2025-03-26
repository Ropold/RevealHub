import {useEffect, useState} from "react";
import axios from "axios";
import {RevealModel} from "./model/RevealModel.ts";
import {Category} from "./model/Category.ts";
import { getCategoryDisplayName } from "./utils/getCategoryDisplayName.ts";
import "./styles/PreviewPlay.css"

import cartoonPic from "../assets/categories/cartoon.jpg";
import animalPic from "../assets/categories/animal.jpg";
import artPic from "../assets/categories/art.jpg";
import randomPic from "../assets/categories/random.jpg";

const categoryImages: Record<Category, string> = {
    CARTOON: cartoonPic,
    ANIMAL: animalPic,
    ART: artPic
};

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
            <h2>Preview Play</h2>
            <p>Select a Category</p>
            <div className="category-images">
                {activeCategories.length > 0 ? (
                    activeCategories.map((category) => (
                        <img
                            key={category}
                            src={categoryImages[category]}
                            alt={getCategoryDisplayName(category)}
                            onClick={() => {
                                setSelectedCategory(category);
                                setRandomCategorySelected(false);
                            }}
                            className={`category-image${!randomCategorySelected && selectedCategory === category ? "-active" : ""}`}
                        />
                    ))
                ) : (
                    <p>Loading categories...</p>
                )}
                <img
                    src={randomPic}
                    alt="Pick Random Category"
                    onClick={() => {
                        selectRandomCategory();
                        setRandomCategorySelected(true);
                    }}
                    className={`category-image${randomCategorySelected ? "-active" : ""}`}
                />
            </div>

            {(selectedCategory || randomCategorySelected) && (
                <p className="selected-category">
                    Selected Category: {randomCategorySelected ? "Random" : selectedCategory ? getCategoryDisplayName(selectedCategory) : ""}
                </p>
            )}
        </div>
    );
}
