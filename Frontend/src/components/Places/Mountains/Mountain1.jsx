import React from "react";
import Img1 from "../../../assets/places/5.jpg";
import MainMountain from "./MainMountain";

const Mountain1 = () => {
  const placeData = {
    _id: "place1",
    title: "Everest Base Camp Trek",
    location: "Khumbu, Nepal",
    description:
      "Experience the world's highest peak up close with our signature Everest Base Camp trek. Journey through Sherpa villages, ancient monasteries, and breathtaking Himalayan landscapes.",
    pricePerDay: 250,
    maxGroupSize: 12,
    images: ["/assets/places/5.jpg"],
    difficulty: "Challenging",
    duration: "14-16 days",
    altitude: "5,364m",
    bestSeason: "Mar-May, Sep-Nov",
  };

  return (
    <MainMountain
      backgroundImage={Img1}
      title="Everest Base Camp Trek"
      description="Embark on the ultimate Himalayan adventure to Everest Base Camp. Trek through stunning mountain landscapes, traditional Sherpa villages, and ancient Buddhist monasteries. Experience the raw beauty of the world's highest peak region while challenging yourself on this iconic journey."
      placesLimit={3}
      excludeLink="/places/mountain-1"
      nextMountainLink="/places/mountain-2"
      altitude="5,364m"
      duration="14-16 days"
      difficulty="Challenging"
      bestSeason="Mar-May, Sep-Nov"
      highlights={[
        "Stand at Everest Base Camp (5,364m)",
        "Sunrise view from Kala Patthar",
        "Explore historic Namche Bazaar",
        "Visit Tengboche Monastery",
        "Cross dramatic suspension bridges",
        "Experience Sherpa culture",
        "View four 8,000m+ peaks",
        "Stay in traditional teahouses",
      ]}
      placeData={placeData}
    />
  );
};

export default Mountain1;
