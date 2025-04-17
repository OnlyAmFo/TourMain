import React from "react";
import MainMountain from "./MainMountain";
import Img3 from "../../../assets/places/7.jpg";

const Mountain3 = () => {
  const placeData = {
    _id: "place3",
    title: "Langtang Valley Trek",
    location: "Langtang, Nepal",
    description:
      "Discover the serene Langtang Valley, known for its unique Tamang heritage, glaciers, and stunning mountain views. Perfect for those seeking a less crowded trekking experience.",
    pricePerDay: 180,
    maxGroupSize: 8,
    images: ["/assets/places/7.jpg"],
    difficulty: "Moderate",
    duration: "7-9 days",
    altitude: "4,984m",
    bestSeason: "Mar-May, Sep-Dec",
  };

  return (
    <MainMountain
      title="Langtang Valley Trek"
      description="Discover the serene Langtang Valley, a hidden gem in Nepal's trekking scene. Experience unique Tamang culture, dramatic mountain landscapes, and pristine wilderness in this less-traveled region."
      backgroundImage={Img3}
      placesLimit={3}
      excludeLink="/places/mountain-3"
      nextMountainLink="/places/mountain-4"
      altitude="4,984m"
      duration="7-9 days"
      difficulty="Moderate"
      bestSeason="Mar-May, Sep-Dec"
      highlights={[
        "Visit Kyanjin Gompa monastery",
        "Climb Tserko Ri viewpoint",
        "Explore Langtang Village",
        "Visit local cheese factory",
        "Experience Tamang culture",
        "View stunning glaciers",
        "See rare wildlife",
        "Taste authentic local cuisine",
      ]}
      placeData={placeData}
    />
  );
};

export default Mountain3;
