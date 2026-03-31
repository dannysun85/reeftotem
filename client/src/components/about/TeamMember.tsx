import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, bio, socials }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-card rounded-[24px] overflow-hidden border border-border group shadow-sm hover:shadow-apple-hover transition-all"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 justify-center">
            {socials?.github && (
              <a href={socials.github} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                <Github className="w-5 h-5" />
              </a>
            )}
            {socials?.linkedin && (
              <a href={socials.linkedin} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {socials?.twitter && (
              <a href={socials.twitter} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
        <p className="text-primary font-medium text-sm mb-4">{role}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">{bio}</p>
      </div>
    </motion.div>
  );
};

export default TeamMember;
