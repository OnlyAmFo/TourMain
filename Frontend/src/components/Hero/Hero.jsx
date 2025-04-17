import React from "react";

const Hero = () => {
  return (
    <div className="bg-black/20 h-full">
      <div className="h-full flex justify-center items-center p-4 bg-primary/10">
        <div className="container grid grid-cols-1 gap-4">
          <div className="text-white">
            <p data-aos="fade-up" className="text-5xl pb-6">
              Welcome to Gurkha Path Adventures
            </p>
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="font-bold text-4xl"
            >
              Search Your Destination
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
