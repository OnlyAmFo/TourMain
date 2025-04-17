import React from "react";
import MainMountain from "./MainMountain";
import Img2 from "../../../assets/places/6.jpg";

const Mountain2 = () => {
  const placeData = {
    _id: "place2",
    title: "Annapurna Circuit Trek",
    location: "Annapurna, Nepal",
    description:
      "Trek around the entire Annapurna massif, crossing the challenging Thorong La Pass and experiencing dramatic changes in landscape, climate, and culture.",
    pricePerDay: 200,
    maxGroupSize: 10,
    images: ["/assets/places/6.jpg"],
    difficulty: "Moderate to Hard",
    duration: "12-14 days",
    altitude: "5,416m",
    bestSeason: "Oct-Nov, Mar-Apr",
  };

  return (
    <MainMountain
      title="Annapurna Circuit Trek"
      description="Journey around the entire Annapurna massif on this classic Himalayan trek. Cross the challenging Thorong La Pass, witness dramatic changes in landscape and climate, and immerse yourself in the diverse cultures of Nepal's mountain communities."
      backgroundImage={Img2}
      placesLimit={3}
      excludeLink="/places/mountain-2"
      nextMountainLink="/places/mountain-3"
      altitude="5,416m"
      duration="12-14 days"
      difficulty="Moderate to Hard"
      bestSeason="Oct-Nov, Mar-Apr"
      highlights={[
        "Cross Thorong La Pass (5,416m)",
        "Visit sacred Muktinath Temple",
        "Explore Tilicho Lake",
        "Relax in natural hot springs",
        "Experience diverse landscapes",
        "Visit traditional villages",
        "View the Annapurna range",
        "Experience local culture",
      ]}
      placeData={placeData}
    />
  );
};

export default Mountain2;
