import React from "react";
import { Button } from "react-bootstrap";
import Nav from "./Nav";
import Map from './Map';
import "../Home.css";

const Home = () => {
  return (
    <>
      <div className="home_container">
        <Nav />
        <div className="home_layout">
          <Map />
          <div className="p-4 box mt-3 text-center">
            Hello Welcome <br />
            temp
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
