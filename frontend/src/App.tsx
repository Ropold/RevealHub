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

export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [allReveals, setAllReveals] = useState<RevealModel[]>([]);
    const [activeReveals, setActiveReveals] = useState<RevealModel[]>([]);


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

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (user !== "anonymousUser") {
            getUserDetails();
        }
    }, [user]);

  return (
    <>
      <Navbar userDetails={userDetails} getUserDetails={getUserDetails} user={user} getUser={getUser} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/play" element={<Play />} />
        <Route path="/list-of-all-reveals" element={<ListOfAllReveals activeReveals={activeReveals} getActiveReveals={getActiveReveals}/>} />
        <Route path="/reveal/:id" element={<Details />} />
        <Route path="/high-score" element={<HighScore />} />

        <Route element={<ProtectedRoute user={user} />}>
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-reveals" element={<MyReveals allReveals={allReveals} getAllReveals={getAllReveals}/>} />
            <Route path="/add" element={<AddRevealCard user={user} handleNewRevealSubmit={handleNewRevealSubmit}/>} />
            <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer/>


    </>
  )
}

