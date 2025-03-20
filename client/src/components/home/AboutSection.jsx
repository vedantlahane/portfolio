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
      <div className="relative sm:right-0 sm:w-auto md:right-40  md:w-[80vw] text-2xl text-gray-400 leading-relaxed">
        {/* Title */}
        <div className="flex space-x-5 items-baseline mb-6">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-slate-500 to-gray-700 bg-clip-text text-transparent">
            About
          </h1>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Me
          </h1>
        </div>

        {/* Intro Section */}
        <div className="font-bold mb-8 space-y-5">
          <p>
            Hey there! I'm a Computer Science Engineering student in my sixth
            semester at Lovely Professional University, Punjab—originally from
            Paratwada, Maharashtra. I spend most of my time coding, breaking
            things, and convincing myself that "it's not a bug, it's a feature."
          </p>
          <p>
            I enjoy building things that (hopefully) don’t break, and when they
            do, I call it “debugging in production.” Lately, I’ve been exploring
            DevOps because deploying stuff without bringing down the entire
            system seems like a skill worth having.
          </p>
          <p>
            I'm currently looking for an SDE internship where I can put my skills
            to work, learn from experienced developers, and maybe even push code
            that doesn’t require an immediate rollback. If you enjoy bad Java
            (the language, not the coffee) jokes, we’ll probably get along.
          </p>
        </div>
      </div>

      {/* Journey So Far */}
      {/* <div className="container mx-auto px-24" data-aos="fade-up">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
          My Journey So Far:
        </h2>
        <ul className="space-y-4">
          <ListItem>
            Started with C++, thinking I'd be the next big game developer—ended
            up making a calculator.
          </ListItem>
          <ListItem>
            Fell into the world of web development, experimented with MERN and
            MEAN stacks, and realized that JavaScript has more quirks than I do.
          </ListItem>
          <ListItem>
            Took on personal projects to test my skills (and patience).
          </ListItem>
          <ListItem>
            Dived into data structures and algorithms—because apparently, they
            help in coding interviews.
          </ListItem>
          <ListItem>
            Eventually, I just find myself staring at my laptop, questioning my
            life choices. But hey, that’s part of the process, right?
          </ListItem>
        </ul>
      </div> */}

      {/* Separator */}
      <GradientSeparator />
    </section>
  );
};

export default AboutSection;
