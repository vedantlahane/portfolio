import HeroSection from './home/HeroSection';
import AboutSection from './home/AboutSection';
import SkillsSection from './home/SkillsSection';
import ProjectsSection from './home/ProjectSection';

// Move this to a separate data.js file if preferred
const skillsData = [
  {
    title: 'React',
    category: 'Frontend Development',
    animationUrl:
      'https://lottie.host/embed/31cc650e-0bf1-4897-a14c-6c87c8601d63/e0tqG9uqvL.lottie',
    isLottie: true
  },
  {
    title: 'Node.js',
    category: 'Backend Development',
    imageUrl: "/src/assets/node-js.svg"
  },
   {
    title: 'Tailwind CSS',
    category: 'Styling',
    imageUrl: 'https://img.icons8.com/color/480/tailwindcss.png'
  },
  {
    title: 'PHP',
    category: 'Backend Development',
    imageUrl: 'https://img.icons8.com/ios-filled/100/php.png'
  },
  {
    title: 'Angular',
    category: 'Frontend Development',
    animationUrl:
      'https://lottie.host/embed/9e110ead-fe06-47cf-9c2c-69708646ebf1/i14Qdy8mWl.lottie',
    isLottie: true
  },
  {
    title: 'Express.js',
    category: 'Backend Development',
    imageUrl: 'https://img.icons8.com/fluency/240/express-js.png'
  },
  {
    title: 'MongoDB',
    category: 'Database',
    animationUrl:
      'https://lottie.host/embed/65dbcd35-959d-4d11-b7b7-65d18f5540a7/lm0xRqXEZG.lottie',
    isLottie: true
  },
  {
    title: 'Bootstrap',
    category: 'Styling',
    imageUrl:"/src/assets/bootsrap.svg"
  },
  {
    title: 'HTML5',
    category: 'Markup Language',
    animationUrl:
      'https://lottie.host/embed/0a5c1d7d-5780-447f-a07d-a7326ae9a697/QSjJ7m58yV.lottie',
    isLottie: true
  },
  {
    title: 'CSS',
    category: 'Styling',
    animationUrl:
      'https://lottie.host/embed/9672f1dd-fb70-4e1c-b81a-617d308b6d5d/sctkkVcDwp.lottie',
    isLottie: true
  },
  {
    title: 'Python',
    category: 'Backend & Data Science',
    imageUrl: 'https://img.icons8.com/color/480/python.png'
  },
  {
    title: 'Java',
    category: 'Backend Development',
    imageUrl: 'https://img.icons8.com/color/480/java-coffee-cup-logo.png'
  },
  {
    title: 'C/C++',
    category: 'Systems Programming',
    imageUrl: 'https://img.icons8.com/color/480/c-plus-plus-logo.png'
  }
];

const Home = () => {
  return (
    <div className="min-h-screen m-4 mx-auto">
      

      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      <SkillsSection skills={skillsData} />
    </div>
  );
};

export default Home;