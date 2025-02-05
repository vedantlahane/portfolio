import SkillCard from './SkillCard';
import GradientSeparator from './GradientSeparator';

const SkillsSection = ({ skills }) => (
  <section className="text-white py-14 min-h-screen">
    <div className="container mx-auto px-4">
      <div className="flex space-x-5 items-baseline mb-10">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-slate-500 to-gray-700 bg-clip-text text-transparent">
          My
        </h1>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Tech Stack
        </h1>
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {skills.map((skill, index) => (
          <SkillCard key={index} {...skill} />
        ))}
      </div>
    </div>
    <GradientSeparator />
  </section>
);

export default SkillsSection;