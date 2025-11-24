'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Rocket, Users, Award } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: Code2, label: 'Projects', value: '50+' },
    { icon: Rocket, label: 'Technologies', value: '20+' },
    { icon: Users, label: 'Collaborations', value: '30+' },
    { icon: Award, label: 'Years Experience', value: '3+' },
  ];

  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold text-white mb-6">
                Passionate Developer & Tech Enthusiast
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                I&apos;m a Full-Stack Developer with a passion for creating innovative solutions 
                that make a difference. With expertise in modern web technologies, cloud 
                computing, and AI/ML, I turn ideas into reality.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Currently focused on building scalable applications with cutting-edge 
                technologies like React, Next.js, Node.js, and cloud platforms. I love 
                learning new technologies and contributing to open-source projects.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Problem Solver
                </span>
                <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Team Player
                </span>
                <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                  Quick Learner
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="text-3xl font-bold text-white mb-1">{stat.value}</h4>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-4">What I Do</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xl font-semibold text-purple-300 mb-2">Web Development</h4>
              <p className="text-slate-300">
                Creating responsive, performant, and user-friendly web applications with modern frameworks.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-purple-300 mb-2">Cloud Solutions</h4>
              <p className="text-slate-300">
                Designing and implementing scalable cloud infrastructure on AWS and Azure.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-purple-300 mb-2">AI/ML Integration</h4>
              <p className="text-slate-300">
                Integrating AI and machine learning capabilities into web applications.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
