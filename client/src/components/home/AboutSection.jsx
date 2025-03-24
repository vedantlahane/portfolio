import { useEffect } from "react";
import ListItem from "./ListItem";
import GradientSeparator from "./GradientSeparator";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1400, once: true });
  }, []);

  return (
    <section className="text-white py-12">
      <div className="relative sm:right-0 sm:w-auto text-2xl leading-relaxed">
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
        <div className="font-normalva mb-8 space-y-5 text-3xl bg-gradient-to-br bg-clip-text from-blue-100 via-blue-300 to-gray-700 text-transparent">
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
            at Lovely Professional University, Punjab — originally from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              Paratwada, Maharashtra.
            </span>{" "}
            I spend most of my time{" "}
            <span className="text-5xl text-indigo-500">coding</span>,{" "}
            <span className="text-purple-500">experimenting with code</span>, and
            convincing myself that errors are just{" "}
            <span className="text-4xl italic text-indigo-600">
              unexpected surprises.
            </span>
          </p>

          <p
            className="border-r-4 pr-4 mb-12 text-right"
            style={{
              borderImage: "linear-gradient(to bottom, #6366f1, #8b5cf6) 1",
            }}
            data-aos="fade-left"
          >
            I love{" "}
            <span className="text-indigo-500 font-extrabold">
              building projects
            </span>{" "}
            that (ideally) run smoothly, and when they don’t, I like to call it{" "}
            <span className="italic text-purple-600">
              “surprise debugging.”
            </span>{" "}
            Recently, I’ve been exploring{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 font-bold">
              DevOps
            </span>{" "}
            because orchestrating seamless deployments is a skill that never goes out of style.
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
            </span>{" "}
            where I can put my skills to work, learn from seasoned developers, and maybe even deploy code that doesn’t cause a system hiccup. If you appreciate clever puns and enjoy debating whether semicolons are optional, we’re bound to click.
          </p>
        </div>
      </div>

      {/* Separator */}
      <GradientSeparator data-aos="fade-up" />
    </section>
  );
};

export default AboutSection;
