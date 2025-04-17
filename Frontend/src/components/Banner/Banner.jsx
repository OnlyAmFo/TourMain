import React from "react";
import TravelImg from "../../assets/19.jpg";
import { MdOutlineLocalHotel } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { IoIosWifi } from "react-icons/io";
import { IoFastFoodSharp } from "react-icons/io5";

const Banner = () => {
  return (
    <div className="min-h-[550px] bg-gray-100 flex items-center justify-center py-12 sm:py-0">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Image section */}
          <div
            data-aos="flip-up"
            className="flex justify-center lg:justify-end"
          >
            <img
              src={TravelImg}
              alt="Travel"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover"
            />
          </div>
          {/* Text content section */}
          <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-8">
            <h1
              data-aos="fade-up"
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
            >
              Explore all corners of the world with us
            </h1>
            <p
              data-aos="fade-up"
              className="text-base sm:text-lg text-gray-500 leading-6 sm:leading-7 md:leading-8"
            >
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque
              reiciendis inventore iste ratione ex alias quis magni at optio
              ratione ex alias quis magni at optio.
            </p>
            <div data-aos="zoom-in" className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <FaHandsHelping className="text-3xl sm:text-4xl shadow-sm p-2 sm:p-4 rounded-full bg-violet-100 dark:bg-violet-400" />
                  <p className="text-sm sm:text-base">Guide</p>
                </div>
                <div className="flex items-center gap-4">
                  <MdOutlineLocalHotel className="text-3xl sm:text-4xl shadow-sm p-2 sm:p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                  <p className="text-sm sm:text-base">Hotel</p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <IoIosWifi className="text-3xl sm:text-4xl shadow-sm p-2 sm:p-4 rounded-full bg-green-100 dark:bg-green-400" />
                  <p className="text-sm sm:text-base">Wi-fi</p>
                </div>
                <div className="flex items-center gap-4">
                  <IoFastFoodSharp className="text-3xl sm:text-4xl shadow-sm p-2 sm:p-4 rounded-full bg-yellow-100 dark:bg-yellow-400" />
                  <p className="text-sm sm:text-base">Foods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
