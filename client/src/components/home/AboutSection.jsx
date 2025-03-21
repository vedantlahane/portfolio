import { useEffect } from "react";
import ListItem from "./ListItem";
import GradientSeparator from "./GradientSeparator";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="text-white py-12">
      <div className="relative sm:right-0 sm:w-auto text-2xl text-gray-400 leading-relaxed">
        {/* Title */}
        <div
          className="flex space-x-5 items-baseline mb-6"
          data-aos="fade-up"
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-slate-500 to-gray-700 bg-clip-text text-transparent">
            About
          </h1>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Me
          </h1>
        </div>

        {/* Intro Section */}
        <div className="font-bold mb-8 space-y-5 text-3xl">
          <p
            className="border-l-4 pl-4 mb-8"
            style={{
              borderImage: "linear-gradient(to bottom, #6366f1, #8b5cf6) 1",
            }}
            data-aos="fade-right"
          >
            Hey there! I'm a{" "}
            <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Computer Science & Engineering
            </span>{" "}
            student in my
            <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              {" "}
              sixth semester
            </span>{" "}
            at Lovely Professional University, Punjab — originally from
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              {" "}
              Paratwada, Maharashtra.
            </span>
            I spend most of my time{" "}
            <span className="text-5xl text-indigo-500">coding</span>,{" "}
            <span className="text-purple-500">breaking things</span>, and
            convincing myself that
            <span className="text-4xl italic text-indigo-600">
              {" "}
              "it's not a bug, it's a feature."
            </span>
          </p>

          <p
            className="border-r-4 pr-4 mb-12 text-right"
            style={{
              borderImage: "linear-gradient(to bottom, #6366f1, #8b5cf6) 1",
            }}
            data-aos="fade-left"
          >
            I enjoy{" "}
            <span className="text-indigo-500 font-extrabold">
              building things
            </span>{" "}
            that (hopefully) don’t break, and when they do, I call it{" "}
            <span className="italic text-purple-600">
              “debugging in production.”
            </span>
            Lately, I’ve been exploring{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">
              DevOps
            </span>{" "}
            because deploying stuff without bringing down the entire system
            seems like a skill worth having.
          </p>

          <p
            className="border-l-4 pl-4"
            style={{
              borderImage: "linear-gradient(to bottom, #6366f1, #8b5cf6) 1",
            }}
            data-aos="fade-right"
          >
            I'm currently looking for an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">
              SDE internship
            </span>
            where I can put my skills to work, learn from experienced
            developers, and maybe even push code that
            <span className="text-red-500 font-extrabold">
              {" "}
              doesn’t require an immediate rollback.
            </span>
            If you enjoy bad <span className="text-indigo-500">Java</span> (the
            language, not the coffee) jokes, we’ll probably get along.
          </p>
        </div>
      </div>

      {/* Separator */}
      <GradientSeparator data-aos="fade-up" />
    </section>
  );
};

export default AboutSection;