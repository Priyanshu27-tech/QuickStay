import React from "react";
import Title from "./title";
import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOffer = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-16 bg-slate-100">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive offers"
          subTitle="take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button className="group flex items-center gap-2 hover:scale-110 transition-transform duration-200 font-medium cursor-pointer max-md:mt-12">
          View All Offers
          <img
            src={assets.arrowIcon}
            alt="arrow-icon"
            className="group-hover:translate-x-1 transition-all duration-200"
          />
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex flex-col justify-between gap-2 pt-12 md:pt-16 px-5 pb-6 rounded-xl text-white bg-no-repeat bg-cover bg-center h-72 overflow-hidden"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            {/* Discount Badge */}
            <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
              {item.priceOff}% OFF
            </p>

            {/* Content */}
            <div>
              <p className="text-2xl font-medium font-playfair">
                {item.title}
              </p>
              <p className="text-sm mt-1">{item.description}</p>
              <p className="text-xs mt-1">
                Expires {item.expiryDate}
              </p>
            </div>

            {/* Button */}
            <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 group-hover:translate-x-1 transition-all duration-200">
              View Offers
              <img
                className="invert group-hover:translate-x-1 transition-all duration-200"
                src={assets.arrowIcon}
                alt="arrow-icon"
              />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ExclusiveOffer;