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

export default function App() {

    const [user, setUser] = useState<string>("anonymousUser");
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);


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
        <Route path="/list-of-all-reveals" element={<ListOfAllReveals />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/high-score" element={<HighScore />} />

        <Route element={<ProtectedRoute user={user} />}>
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-reveals" element={<MyReveals />} />
            <Route path="/add" element={<AddRevealCard />} />
            <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer/>


    </>
  )
}

