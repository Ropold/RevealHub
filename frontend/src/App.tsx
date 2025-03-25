import './App.css'
import {useEffect, useState} from "react";
import axios from "axios";
import Navbar from "./components/Navbar.tsx";
import ListOfAllReveals from "./components/ListOfAllReveals.tsx";
import Welcome from "./components/Welcome.tsx";
import Play from "./components/Play.tsx";
import Profile from "./components/Profile.tsx";
import AddRevealCard from "./components/AddRevealCard.tsx";
import MyReveals from "./components/MyReveals.tsx";
import Details from "./components/Details.tsx";
import Favorites from "./components/Favorites.tsx";
import HighScore from "./components/HighScore.tsx";
import NotFound from "./components/NotFound.tsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {UserDetails} from "./components/model/UserDetailsModel.ts";
import {RevealModel} from "./components/model/RevealModel.ts";
import {HighScoreModel} from "./components/model/HighScoreModel.ts";


export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [allReveals, setAllReveals] = useState<RevealModel[]>([]);
    const [activeReveals, setActiveReveals] = useState<RevealModel[]>([]);
    const [highScoresOverTime, setHighScoresOverTime] = useState<HighScoreModel[]>([]);
    const [highScoresWithClicks, setHighScoresWithClicks] = useState<HighScoreModel[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    //Reveal functions
    const getAllReveals = () => {
        axios
            .get("/api/reveal-hub")
            .then((response) => {
                setAllReveals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching reveals: ", error);
            });
    }

    const getActiveReveals = () => {
        axios
            .get("/api/reveal-hub/active")
            .then((response) => {
                setActiveReveals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching active reveals: ", error);
            });
    }

    const handleNewRevealSubmit = (newReveal: RevealModel) => {
        setAllReveals((prevReveals) => [...prevReveals, newReveal]);
    }

    // User functions
    function getUser() {
        axios.get("/api/users/me")
            .then((response) => {
                setUser(response.data.toString());
            })
            .catch((error) => {
                console.error(error);
                setUser("anonymousUser");
            });
    }

    function getUserDetails() {
        axios.get("/api/users/me/details")
            .then((response) => {
                setUserDetails(response.data as UserDetails);
            })
            .catch((error) => {
                console.error(error);
                setUserDetails(null);
            });
    }

    function getAppUserFavorites(){
        axios.get<RevealModel[]>(`/api/reveal-hub/favorites`)
            .then((response) => {
                const favoriteIds = response.data.map((memory) => memory.id);
                setFavorites(favoriteIds);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function toggleFavorite(revealId: string) {
        const isFavorite = favorites.includes(revealId);

        if (isFavorite) {
            axios.delete(`/api/reveal-hub/favorites/${revealId}`)
                .then(() => {
                    setFavorites((prevFavorites) =>
                        prevFavorites.filter((id) => id !== revealId)
                    );
                })
                .catch((error) => console.error(error));
        } else {
            axios.post(`/api/reveal-hub/favorites/${revealId}`)
                .then(() => {
                    setFavorites((prevFavorites) => [...prevFavorites, revealId]);
                })
                .catch((error) => console.error(error));
        }
    }

    // HighScore functions
    const getHighScoresOverTime = () => {
        axios
            .get("/api/high-score/reveal-over-time")
            .then((response) => {
                setHighScoresOverTime(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const getHighScoresWithClicks = () => {
        axios
            .get("/api/high-score/reveal-with-clicks")
            .then((response) => {
                setHighScoresWithClicks(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user !== "anonymousUser") {
            getUserDetails();
            getAppUserFavorites();
        }
    }, [user]);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

  return (
    <>
      <Navbar userDetails={userDetails} getUserDetails={getUserDetails} user={user} getUser={getUser} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/play" element={<Play user={user}/>} />
        <Route path="/list-of-all-reveals" element={<ListOfAllReveals activeReveals={activeReveals} getActiveReveals={getActiveReveals} favorites={favorites} toggleFavorite={toggleFavorite} user={user}/>} />
        <Route path="/reveal/:id" element={<Details/>} />
        <Route path="/high-score" element={<HighScore highScoresOverTime={highScoresOverTime} highScoresWithClicks={highScoresWithClicks} getHighScoresOverTime={getHighScoresOverTime} getHighScoresWithClicks={getHighScoresWithClicks}/>} />

        <Route element={<ProtectedRoute user={user} />}>
            <Route path="/favorites" element={<Favorites favorites={favorites} user={user} toggleFavorite={toggleFavorite}/>} />
            <Route path="/my-reveals" element={<MyReveals allReveals={allReveals} getAllReveals={getAllReveals} setAllReveals={setAllReveals} user={user} favorites={favorites} toggleFavorite={toggleFavorite}/>} />
            <Route path="/add" element={<AddRevealCard user={user} handleNewRevealSubmit={handleNewRevealSubmit}/>} />
            <Route path="/profile" element={<Profile userDetails={userDetails}/>} />
        </Route>
      </Routes>
      <Footer/>


    </>
  )
}

