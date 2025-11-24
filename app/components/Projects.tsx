'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ExternalLink, Code2 } from 'lucide-react';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      title: 'My Portfolio Website',
      description: 'A modern, responsive portfolio website showcasing my projects and skills with smooth animations and a beautiful UI.',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      github: 'https://github.com/M-Hasan-11/My-Portfolio-Website',
      live: 'https://m-hasan-11.github.io',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'AuraLens',
      description: 'Advanced computer vision application with AI capabilities for real-time image processing and analysis.',
      tags: ['Python', 'OpenCV', 'TensorFlow', 'FastAPI'],
      github: 'https://github.com/M-Hasan-11/AuraLens',
      live: '#',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'AI Story Weaver',
      description: 'AI-powered storytelling platform that creates engaging narratives using advanced language models.',
      tags: ['React', 'Node.js', 'OpenAI', 'MongoDB'],
      github: 'https://github.com/M-Hasan-11/AI-Story-Weaver',
      live: '#',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'CYBERSPACE SEARCH',
      description: 'Specialized search engine with advanced filtering capabilities and modern UI for enhanced search experience.',
      tags: ['Vue.js', 'Express', 'Elasticsearch', 'Docker'],
      github: 'https://github.com/M-Hasan-11/CYBERSPACE-SEARCH',
      live: '#',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.',
      tags: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS'],
      github: '#',
      live: '#',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Real-time Chat App',
      description: 'Real-time messaging application with group chats, file sharing, and end-to-end encryption.',
      tags: ['React', 'Socket.io', 'Node.js', 'Redis'],
      github: '#',
      live: '#',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            A selection of my recent work and side projects
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className={`h-2 bg-gradient-to-r ${project.gradient}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <Code2 className="w-6 h-6 text-purple-400" />
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span className="text-sm">Code</span>
                    </a>
                  )}
                  {project.live !== '#' && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span className="text-sm">Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/M-Hasan-11"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            <Github className="w-5 h-5" />
            View More on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
