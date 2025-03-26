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
    selectedCategory: Category | null;
    setSelectedCategory: (category: Category) => void;
    randomCategorySelected: boolean;
    setRandomCategorySelected: (selected: boolean) => void;
}

export default function PreviewPlay(props: Readonly<PreviewPlayProps>){
    const [activeCategories, setActiveCategories] = useState<Category[]>([]);


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
            props.setSelectedCategory(activeCategories[randomIndex]);
        }
    }

    useEffect(() => {
        if (props.selectedCategory) {
            getRevealsByCategory(props.selectedCategory);
        }
    }, [props.selectedCategory]);


    useEffect(() => {
        getActiveCategories()
    }, []);


    return (
        <div className="preview-play">
            <h3>
                Selected Category:
                <strong
                    className={`selected-category ${props.selectedCategory === null ? "no-category" : ""}`}
                >
                    {props.randomCategorySelected
                        ? "Random"
                        : props.selectedCategory
                            ? getCategoryDisplayName(props.selectedCategory)
                            : "No category selected"}
                </strong>
            </h3>
            <div className="category-images">
                <div>
                    <img
                        src={randomPic}
                        alt="Pick Random Category"
                        onClick={() => {
                            selectRandomCategory();
                            props.setRandomCategorySelected(true);
                        }}
                        className={`category-image-active ${props.randomCategorySelected ? "category-image-active-selected" : ""}`}
                    />
                    <figcaption>
                        Random
                    </figcaption>
                </div>
                {ALL_CATEGORIES.map((category) => {
                    const isActive = activeCategories.includes(category);

                    return (
                        <div key={category}>
                            <img
                                src={categoryImages[category]}
                                alt={getCategoryDisplayName(category)}
                                onClick={() => {
                                    if (isActive) {
                                        props.setSelectedCategory(category);
                                        props.setRandomCategorySelected(false);
                                    }
                                }}
                                className={`category-image ${isActive ? "category-image-active" : ""} ${props.selectedCategory === category && isActive && !props.randomCategorySelected ? "category-image-active-selected" : ""}`}
                            />
                            <figcaption>
                                {getCategoryDisplayName(category)}
                            </figcaption>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}