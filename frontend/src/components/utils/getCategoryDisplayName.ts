import { Category } from "../model/Category.ts";

export function getCategoryDisplayName(category: Category): string {
    const categoryDisplayNames: Record<Category, string> = {
        ANIMAL: "Animal",
        ART: "Art",
        BUILDING: "Building",
        CARTOON: "Cartoon",
        COOKING: "Cooking",
        CITY: "City",
        CLOTHING: "Clothing",
        COUNTRY: "Country",
        FOOD: "Food",
        GAME: "Game",
        INSTRUMENT: "Instrument",
        MOVIE: "Movie",
        MUSIC: "Music",
        PERSON: "Person",
        PLANT: "Plant",
        SPORTS: "Sports",
        TOOL: "Tool",
        VEHICLE: "Vehicle"
    };

    return categoryDisplayNames[category]
}
