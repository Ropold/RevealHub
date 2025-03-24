import {Category} from "./Category.ts";

export type RevealModel = {
    id: string;
    name: string;
    solutionWords: string[];
    closeSolutionWords: string[];
    category: Category;
    description: string;
    isActive: boolean;
    githubId: string;
    imageUrl: string;
}

export const DefaultReveal: RevealModel = {
    id: "",
    name: "Loading....",
    solutionWords: ["true"],
    closeSolutionWords: ["close"],
    category: "ANIMAL",
    description: "",
    isActive: true,
    githubId: "",
    imageUrl: "",
};


