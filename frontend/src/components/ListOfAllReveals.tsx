import { RevealModel } from "./model/RevealModel.ts";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RevealCard from "./RevealCard.tsx";
import SearchBar from "./SearchBar.tsx";

type ListOfAllRevealsProps = {
    activeReveals: RevealModel[];
    getActiveReveals: () => void;
    favorites: string[];
    toggleFavorite: (revealId: string) => void;
    user: string;
    currentPage: number;
    setCurrentPage: (pageNumber: number) => void;
};

export default function ListOfAllReveals(props: Readonly<ListOfAllRevealsProps>) {
    const [isSpoiler, setIsSpoiler] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredReveals, setFilteredReveals] = useState<RevealModel[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<RevealModel["category"] | "">("");
    const [revealsPerPage, setRevealsPerPage] = useState<number>(9);

    const location = useLocation();


    useEffect(() => {
        props.getActiveReveals();
    }, []);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    useEffect(() => {
        const updateRevealsPerPage = () => {
            if (window.innerWidth < 768) {
                setRevealsPerPage(8);
            } else if (window.innerWidth < 1200) {
                setRevealsPerPage(9);
            } else {
                setRevealsPerPage(12);
            }
        };
        updateRevealsPerPage();
        window.addEventListener("resize", updateRevealsPerPage);

        return () => {
            window.removeEventListener("resize", updateRevealsPerPage);
        };
    }, []);

    const filterReveals = (reveals: RevealModel[], query: string, category: string) => {
        return reveals.filter((reveal) => {
            const matchesCategory = category ? reveal.category === category : true;
            const matchesSearch =
                reveal.name.toLowerCase().includes(query.toLowerCase()) ||
                reveal.description.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    useEffect(() => {
        setFilteredReveals(filterReveals(props.activeReveals, searchQuery, selectedCategory));
    }, [props.activeReveals, searchQuery, selectedCategory]);

    const getPaginationData = () => {
        const indexOfLastReveal = props.currentPage * revealsPerPage;
        const indexOfFirstReveal = indexOfLastReveal - revealsPerPage;
        const currentReveals = filteredReveals.slice(indexOfFirstReveal, indexOfLastReveal);
        const totalPages = Math.ceil(filteredReveals.length / revealsPerPage);
        return { currentReveals, totalPages };
    };

    const { currentReveals, totalPages } = getPaginationData();


    return (
        <>
            <div>
                <h2>List Of All Reveals - Don't Spoiler yourself!</h2>
                {!isSpoiler && <button className="button-group-button" onClick={() => setIsSpoiler(true)}>I don't care - show me</button>}
                {isSpoiler && <button className="button-grey" onClick={() => setIsSpoiler(false)}>Hide all Reveals</button>}
            </div>
            {isSpoiler && (
            <>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                activeReveals={props.activeReveals}
            />

            <div className="reveal-card-container">
                {currentReveals.map((r) => (
                    <RevealCard
                        key={r.id}
                        reveal={r}
                        user={props.user}
                        favorites={props.favorites}
                        toggleFavorite={props.toggleFavorite}
                    />
                ))}
            </div>
            <div className="space-between">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={"button-group-button"}
                        id={index +1 === props.currentPage ? "active-paginate" : undefined}
                        onClick={() => {
                            props.setCurrentPage(index + 1);
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            </>
            )}
        </>
    )
}