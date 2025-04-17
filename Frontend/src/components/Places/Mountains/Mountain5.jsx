import React from "react";
import MainMountain from "./MainMountain";
import Img5 from "../../../assets/places/9.jpg";

const Mountain5 = () => {
  const placeData = {
    _id: "place5",
    title: "Upper Mustang Trek",
    location: "Mustang, Nepal",
    description:
      "Journey into the hidden kingdom of Lo, featuring dramatic landscapes, ancient monasteries, and preserved Tibetan culture in this rain-shadow region.",
    pricePerDay: 300,
    maxGroupSize: 8,
    images: ["/assets/places/9.jpg"],
    difficulty: "Moderate",
    duration: "10-12 days",
    altitude: "3,840m",
    bestSeason: "Jun-Aug",
  };

  return (
    <MainMountain
      title="Upper Mustang Trek"
      description="Step into the mystical former kingdom of Lo, where ancient Tibetan culture thrives in a dramatic desert landscape. Explore medieval monasteries, sacred caves, and traditional villages in this unique rain-shadow region."
      backgroundImage={Img5}
      placesLimit={3}
      excludeLink="/places/mountain-5"
      nextMountainLink="/places/mountain-6"
      altitude="3,840m"
      duration="10-12 days"
      difficulty="Moderate"
      bestSeason="Jun-Aug"
      highlights={[
        "Explore Lo Manthang",
        "Visit ancient sky caves",
        "See centuries-old monasteries",
        "Experience desert landscapes",
        "Visit Muktinath Temple",
        "Meet local nomads",
        "View unique architecture",
        "Experience Tibetan culture",
      ]}
      placeData={placeData}
    />
  );
};

export default Mountain5;
