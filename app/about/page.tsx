"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, GraduationCap } from "lucide-react";

// Refined: experience dates are now shown clearly and visually separated
const experiences = [
  {
    type: "work",
    icon: Briefcase,
    iconBg: "bg-blue-500",
    title: "Software Engineer",
    place: "AcrossAssist Fintech, Gurugram (Onsite)",
    start: " July 2025",
    end: "Present",
    duration: "July 2025 – Present",
    description:
      "Onsite Software Engineer role at AcrossAssist Fintech, Gurugram, focused on developing, maintaining, and scaling fintech products as part of the core technology team.",
  },
  {
    type: "work",
    icon: Briefcase,
    iconBg: "bg-blue-500",
    title: "Full Stack Developer",
    place: "Squib Factory, Delhi NCR (100% Remote from Bareilly)",
    start: "1 July 2023",
    end: "24 July 2025",
    duration: "July 2023 – July 2025",
    description:
      "Served as a Full Stack Developer working remotely from Bareilly for Squib Factory, Delhi NCR. Responsible for both frontend and backend development on diverse projects in a remote team environment.",
  },
  {
    type: "work",
    icon: Briefcase,
    iconBg: "bg-blue-500",
    title: "Software Engineer",
    place: "Cloud Analogy Software Company, Noida Sector 63 (Onsite)",
    start: "6 July 2021",
    end: "1 June 2023",
    duration: "July 2021 – June 2023",
    description:
      "Worked onsite as a Software Engineer at Cloud Analogy in Noida Sector 63. Contributed to web application development, collaborated with cross-functional teams, and provided technical solutions for clients.",
  },
];

const education = [
  {
    type: "edu",
    icon: GraduationCap,
    iconBg: "bg-emerald-500",
    title: "MCA (Master of Computer Applications)",
    place: "Ajay Kumar Garg Engineering College, Ghaziabad (AKTU)",
    start: "2020",
    end: "2022",
    duration: "2020 – 2022",
    description:
      "Pursued MCA at AKGEC (affiliated to AKTU), Ghaziabad, with emphasis on advanced software engineering and development skills.",
  },
  {
    type: "edu",
    icon: GraduationCap,
    iconBg: "bg-emerald-500",
    title: "BCA (Bachelor of Computer Applications)",
    place: "Bareilly College, M.J.P. Rohilkhand University (MJPRU)",
    start: "2017",
    end: "2020",
    duration: "2017 – 2020",
    description:
      "Completed BCA from Bareilly College, MJPRU, focused on foundational computer science concepts and programming.",
  },
];

const scrollAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const itemAnim = (delay = 0) => ({
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay },
  },
});

// Refined Card: start and end date highlighted visually
const formatDateRange = (start: string, end: string) => {
  return (
    <span>
      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary mr-1">{start}</span>
      <span className="mx-1 text-muted-foreground font-bold">to</span>
      {end === "Present" || end === "Now" ? (
        <motion.span
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-600"
        >
          {end}
        </motion.span>
      ) : (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">{end}</span>
      )}
    </span>
  );
};

const Timeline = ({ data }: { data: typeof experiences }) => (
  <div className="relative border-l-4 border-primary/30 pl-8">
    {data.map((item, idx) => {
      const Icon = item.icon;
      // Refined: always show start/end as visually separated pills, and animate 'Present'
      return (
        <motion.div
          key={item.title + item.start}
          className="mb-12 last:mb-0 relative group"
          initial={{ opacity: 0, x: 80, scale: 0.96 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            type: "spring",
            duration: 0.8,
            delay: idx * 0.15,
            bounce: 0.35,
          }}
          viewport={{ once: true }}
        >
          {/* Icon pulse & entrance */}
          <motion.span
            className="absolute -left-12 top-1.5 bg-primary rounded-full flex items-center justify-center w-8 h-8 shadow-lg z-10"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.1, 1], opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 16,
              delay: idx * 0.15 + 0.1,
            }}
          >
            <Icon className="w-5 h-5 text-white drop-shadow-md" />
          </motion.span>
          <motion.div
            className="bg-card/90 rounded-lg shadow-xl border border-primary/10 px-6 py-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: idx * 0.13 + 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.span
                className="font-bold text-lg"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.13 + 0.17, duration: 0.4 }}
                viewport={{ once: true }}
              >
                {item.title}
              </motion.span>
              <motion.span
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.13 + 0.19, duration: 0.4 }}
                viewport={{ once: true }}
              >
                · {item.place}
              </motion.span>
            </div>
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.13 + 0.21, duration: 0.3 }}
              viewport={{ once: true }}
            >
              {formatDateRange(item.start, item.end)}
            </motion.div>
            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.13 + 0.25, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {item.description}
            </motion.div>
          </motion.div>
        </motion.div>
      );
    })}
  </div>
);

export default function About() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 pt-14 pb-8 sm:pt-20 sm:pb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scrollAnimation}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollAnimation}
          >
            Hello, I&apos;m a{" "}
            <span className="text-primary">Full-Stack Developer</span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              },
            }}
          >
            I&apos;m passionate about crafting beautiful, intuitive, and
            performant web experiences.
            <br className="hidden sm:block" />
            {` `}
            Building ideas into reality with clean code and careful design.
          </motion.p>
        </div>
      </motion.section>

      {/* Info Cards Section */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12 md:pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                className="relative w-full aspect-square rounded-lg overflow-hidden order-1 md:order-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6 },
                  },
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop"
                  alt="Profile picture"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
              <motion.div
                className="space-y-3 sm:space-y-4 order-2 md:order-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.6, delay: 0.2 },
                  },
                }}
              >
                <p className="text-base sm:text-lg text-muted-foreground">
                  I&apos;m a passionate full-stack developer with a love for
                  creating beautiful, functional, and user-friendly web
                  applications.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground">
                  With expertise in modern JavaScript frameworks, I bring ideas
                  to life through clean code and thoughtful design.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground">
                  When not building, I love to explore new technologies and
                  share knowledge in the community.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Experience Timeline */}
      <motion.section
        className="py-12 sm:py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-8 sm:mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollAnimation}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center">
                Experience Journey
              </h2>
            </motion.div>
            <Timeline data={experiences} />
          </div>
        </div>
      </motion.section>

      {/* Education Timeline */}
      <motion.section
        className="py-12 sm:py-16 md:py-20 bg-muted/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollAnimation}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-8 sm:mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scrollAnimation}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center">
                My Education
              </h2>
            </motion.div>
            <Timeline data={education} />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
