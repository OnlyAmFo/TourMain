import React from "react";
import BlogCard from "./BlogCard";
import { BlogsData } from "../../data/blogsData";
import Img1 from "../../assets/places/1.png";

const BlogList = () => {
  return (
    <div>
      <div
        className="mb-20 min-h-screen bg-gray-100"
        style={{
          backgroundImage: `url(${Img1})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
        }}
      >
        <div
          data-aos="fade-up"
          className="pt-20 pb-40 px-4 sm:px-10 md:px-20 lg:px-40 flex justify-center items-center flex-col text-white"
        >
          <h1 className="my-4 border-l-8 border-primary/50 py-2 pl-2 text-2xl md:text-3xl font-bold">
            Our Blogs
          </h1>
          <p className="text-center text-sm md:text-base">
            Embark on a journey through Nepal, where every destination unveils a
            unique blend of natural splendor and cultural richness. Marvel at
            the breathtaking beauty of the Himalayas, home to some of the
            world's highest peaks, offering unparalleled trekking experiences
            that take you through diverse landscapes and panoramic vistas.
          </p>
        </div>
      </div>

      <section
        data-aos="fade-up"
        className="container mb-20 px-4 sm:px-10 lg:px-20"
      >
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-2xl md:text-3xl font-bold">
          Our Latest Blogs
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {BlogsData.map((item) => (
            <BlogCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogList;
