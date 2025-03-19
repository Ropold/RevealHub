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


