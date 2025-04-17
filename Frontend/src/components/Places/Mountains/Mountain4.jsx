import React from "react";
import MainMountain from "./MainMountain";
import Img4 from "../../../assets/places/8.jpg";

const Mountain4 = () => {
  const placeData = {
    _id: "place4",
    title: "Manaslu Circuit Trek",
    location: "Manaslu, Nepal",
    description:
      "Experience one of Nepal's most authentic treks around the world's eighth highest mountain. Enjoy pristine mountain views and rich cultural heritage.",
    pricePerDay: 220,
    maxGroupSize: 10,
    images: ["/assets/places/8.jpg"],
    difficulty: "Challenging",
    duration: "14-16 days",
    altitude: "5,160m",
    bestSeason: "Mar-May, Sep-Nov",
  };

  return (
    <MainMountain
      title="Manaslu Circuit Trek"
      description="Journey around the world's eighth highest mountain on this spectacular circuit trek. Experience pristine landscapes, ancient monasteries, and authentic village life in one of Nepal's most rewarding adventures."
      backgroundImage={Img4}
      placesLimit={3}
      excludeLink="/places/mountain-4"
      nextMountainLink="/places/mountain-5"
      altitude="5,160m"
      duration="14-16 days"
      difficulty="Challenging"
      bestSeason="Mar-May, Sep-Nov"
      highlights={[
        "Cross Larkya La Pass (5,160m)",
        "Visit ancient monasteries",
        "Experience remote village life",
        "View diverse ecosystems",
        "See Mt. Manaslu up close",
        "Cross dramatic suspension bridges",
        "Spot rare wildlife",
        "Experience Tibetan culture",
      ]}
      placeData={placeData}
    />
  );
};

export default Mountain4;
