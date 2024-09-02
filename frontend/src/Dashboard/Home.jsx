import React from "react";
import Navbar from "../components/common/Navbar";
import Cards from "../components/core/Cards";
import "./home.css"
const Home = () => {
  return (
    <div className="">
      <Navbar />
      <div className="Section-cards">
        <Cards />
      </div>
    </div>
  );
};

export default Home;
