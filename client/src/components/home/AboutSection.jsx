import { useEffect } from 'react';
import ListItem from './ListItem';
import GradientSeparator from './GradientSeparator';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutSection = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <section className="text-white py-8 ">
            
            <div className="container mx-auto px-24">
                
                
                <div data-aos="fade-up">
                    
                    <h1 className="text-4xl font-bold mb-6">More about me...</h1>
                    <p className="text-xl font-medium leading-relaxed mb-8">
                    As a Computer Science Engineering student in my sixth semester at Lovely Professional University, Punjab, and hailing from Paratwada, Maharashtra, I aim to become a skilled Full Stack Developer. I am currently looking for an SDE internship to apply my knowledge and enhance my skills.
                    </p>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
                        My Journey So Far:
                    </h2>
                    <ul className="space-y-4">
                        <ListItem>Experimenting with stacks like MERN and MEAN.</ListItem>
                        <ListItem>Building projects that test and expand my creativity.</ListItem>
                        <ListItem>Improving my ability to tackle challenging problems by mastering data structures and algorithms.</ListItem>
                        <ListItem>Eventually, I just find myself swearing at my laptop.</ListItem>
                    </ul>
                </div>
            </div>
            <GradientSeparator />
        </section>
    );
};

export default AboutSection;
