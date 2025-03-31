import { RevealModel } from "./model/RevealModel.ts";
import "./styles/SearchBar.css";
import "./styles/Buttons.css";
import * as React from "react";
import {getCategoryDisplayName} from "./utils/getCategoryDisplayName.ts";

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    selectedCategory: RevealModel["category"] | "";
    setSelectedCategory: (category: RevealModel["category"] | "") => void;
    activeReveals: RevealModel[];
};

const SearchBar: React.FC<SearchBarProps> = ({
                                                 searchQuery,
                                                 setSearchQuery,
                                                 selectedCategory,
                                                 setSelectedCategory,
                                                 activeReveals,
                                             }) => {
    const categories = Array.from(new Set(activeReveals.map((reveal) => reveal.category))).sort();

    const handleReset = () => {
        setSearchQuery("");
        setSelectedCategory("");
    };

    return (
        <div className="search-bar">
            {/* Name-Suche */}
            <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="search-input"
            />
            <label id="category-filter-label">
                <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value as RevealModel["category"] | "")}
                >
                    <option value="">Filter by Category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {getCategoryDisplayName(category)}
                        </option>
                    ))}
                </select>
            </label>

            {/* Reset-Button */}
            <button
                onClick={handleReset}
                className={`${searchQuery || selectedCategory ? "button-group-button" : "reset-button-not-possible"}`}
            >
                Reset Filters
            </button>
        </div>
    );
}
export default SearchBar;

