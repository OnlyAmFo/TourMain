import React from "react";
import MainMountain from "./MainMountain";
import Img6 from "../../../assets/places/10.jpg";

const Mountain6 = () => {
  const placeData = {
    _id: "place6",
    title: "Gokyo Lakes Trek",
    location: "Khumbu, Nepal",
    description:
      "Visit the stunning turquoise lakes of Gokyo and climb Gokyo Ri for panoramic views of Everest, Lhotse, Makalu, and Cho Oyu.",
    pricePerDay: 230,
    maxGroupSize: 10,
    images: ["/assets/places/10.jpg"],
    difficulty: "Moderate to Hard",
    duration: "12-14 days",
    altitude: "5,357m",
    bestSeason: "Mar-May, Sep-Nov",
  };

  return (
    <MainMountain
      title="Gokyo Lakes Trek"
      description="Discover the magical turquoise lakes of Gokyo and witness breathtaking panoramic views of four 8,000m peaks. This alternative to the classic Everest Base Camp trek offers stunning landscapes and a more peaceful trekking experience."
      backgroundImage={Img6}
      placesLimit={3}
      excludeLink="/places/mountain-6"
      nextMountainLink="/places/mountain-1"
      altitude="5,357m"
      duration="12-14 days"
      difficulty="Moderate to Hard"
      bestSeason="Mar-May, Sep-Nov"
      highlights={[
        "Visit turquoise Gokyo Lakes",
        "Climb Gokyo Ri (5,357m)",
        "View Ngozumpa Glacier",
        "Cross Cho La Pass",
        "See four 8,000m peaks",
        "Visit Sherpa villages",
        "Experience high-altitude wilderness",
        "Photograph stunning landscapes",
      ]}
      placeData={placeData}
    />
  );
};

export default Mountain6;
