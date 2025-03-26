import animalPic from "../../assets/categories/animal.jpg";
import artPic from "../../assets/categories/art.jpg";
import buildingPic from "../../assets/categories/building.jpg";
import cartoonPic from "../../assets/categories/cartoon.jpg";
import cookingPic from "../../assets/categories/cooking.jpg";
import cityPic from "../../assets/categories/city.jpg";
import clothingPic from "../../assets/categories/clothing.jpg";
import countryPic from "../../assets/categories/country.jpg";
import foodPic from "../../assets/categories/food.jpg";
import gamePic from "../../assets/categories/game.jpg";
import instrumentPic from "../../assets/categories/instrument.jpg";
import moviePic from "../../assets/categories/movie.jpg";
import musicPic from "../../assets/categories/music.jpg";
import personPic from "../../assets/categories/person.jpg";
import plantPic from "../../assets/categories/plant.jpg";
import sportsPic from "../../assets/categories/sports.jpg";
import toolPic from "../../assets/categories/tool.jpg";
import vehiclePic from "../../assets/categories/vehicle.jpg";
import {Category} from "../model/Category.ts";

export const categoryImages: Record<Category, string> = {
    CARTOON: cartoonPic,
    ANIMAL: animalPic,
    ART: artPic,
    BUILDING: buildingPic,
    COOKING: cookingPic,
    CITY: cityPic,
    CLOTHING: clothingPic,
    COUNTRY: countryPic,
    FOOD: foodPic,
    GAME: gamePic,
    INSTRUMENT: instrumentPic,
    MOVIE: moviePic,
    MUSIC: musicPic,
    PERSON: personPic,
    PLANT: plantPic,
    SPORTS: sportsPic,
    TOOL: toolPic,
    VEHICLE: vehiclePic,
};