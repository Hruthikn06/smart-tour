"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Globe,
  Layers,
  Zap,
  ArrowRight,
  Menu,
  X,
  CuboidIcon as Cube,
  Brain,
  User,
  Mic,
  Camera,
  BarChart,
} from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../components/ui/button";
import Link from "next/link";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black overflow-hidden">
      {/* 3D Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,0,255,0.15),transparent_70%)]"></div>
        <div className="grid-background"></div>
      </div>

      {/* Floating 3D Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute cube-3d"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cube className="h-8 w-8 text-fuchsia-500" />
              <span className="text-white font-bold text-xl">NAVION</span>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                  <X className="text-white" />
                ) : (
                  <Menu className="text-white" />
                )}
              </Button>
            </div>

            <nav
              className={`${
                menuOpen ? "flex" : "hidden"
              } md:flex absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto md:right-auto flex-col md:flex-row items-center gap-6 bg-black/80 md:bg-transparent p-6 md:p-0`}
            >
              <Link href={"/cameratour"}>
                <Button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white border-0">
                  Get Started
                </Button>
              </Link>

              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="px-4 py-2 rounded-full bg-white/10 text-fuchsia-400 text-sm font-medium">
                    NEXT GENERATION TOUR GUIDE
                  </span>
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Enter the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                    Navion
                  </span>{" "}
                  of Digital Tour Guide
                </motion.h1>

                <motion.p
                  className="text-xl text-white/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Break free from the constraints of traditional design. Our
                  platform brings your ideas to life in a stunning 3D digital
                  environment.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <a
                    href="/cameratour"
                    target="_blank"
                    className="hover:cursor-pointer"
                  >
                    <Button className="bg-gradient-to-r from-fuchsia-600 hover:cursor-pointer to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl">
                      Use Tour guide
                    </Button>
                  </a>
                </motion.div>
              </div>

              <div className="lg:w-1/2">
                <motion.div
                  className="perspective-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <div
                    className="cube-wrapper"
                    style={{
                      transform: `rotateX(${scrollY * 0.05}deg) rotateY(${
                        scrollY * 0.05
                      }deg)`,
                    }}
                  >
                    <div className="cube">
                      <div className="cube-face front"></div>
                      <div className="cube-face back"></div>
                      <div className="cube-face right"></div>
                      <div className="cube-face left"></div>
                      <div className="cube-face top"></div>
                      <div className="cube-face bottom"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Cutting-Edge <span className="text-fuchsia-500">Features</span>
              </motion.h2>
              <motion.p
                className="text-xl text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Discover what makes our platform revolutionary
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="feature-card-inner">
                    <div className="feature-card-front">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-white/70">{feature.description}</p>
                    </div>
                    <div className="feature-card-back">
                      <p className="text-white/90 mb-6">{feature.details}</p>
                      <Button className="bg-white text-purple-900 hover:bg-white/90">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/20 to-purple-900/20 z-0"></div>
          <div className="container mx-auto relative z-10">
            <div className="bg-gradient-to-r from-black/40 to-purple-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="lg:w-2/3">
                  <motion.h2
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    Ready to Transform And upgrade Your Local tour guide.
                  </motion.h2>
                  <motion.p
                    className="text-xl text-white/70"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    Join thousands of creators who have already elevated their
                    online experience with our platform.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button className="bg-white hover:bg-white/90 text-purple-900 text-lg px-8 py-6 rounded-xl">
                    Get Started Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10 backdrop-blur-md bg-black/20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-6 md:mb-0">
                <Cube className="h-8 w-8 text-fuchsia-500" />
                <span className="text-white font-bold text-xl">DEEPIKA</span>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
              © {new Date().getFullYear()} Dimension. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollY > 100 ? 0 : 1 }}
        >
          <span className="text-white/60 text-sm mb-2">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          >
            <ChevronDown className="text-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
const features = [
  {
    title: "AI-Powered Guide",
    description: "Interact with a smart, lifelike AI tour guide",
    details:
      "Our AI-driven meta-human provides real-time insights, historical context, and answers to your questions with natural voice interactions.",
    icon: <Brain className="h-8 w-8 text-white" />,
  },
  {
    title: "Realistic Meta-Human",
    description: "A fully animated, lifelike digital tour guide",
    details:
      "Built with advanced AI and 3D modeling, our meta-human mimics human-like gestures, expressions, and speech for an engaging experience.",
    icon: <User className="h-8 w-8 text-white" />,
  },
  {
    title: "Live & Interactive Tours",
    description: "Experience real-time guided tours with AI narration",
    details:
      "Whether exploring a museum, historical site, or virtual world, the AI guide responds to voice commands and adapts to your interests.",
    icon: <Mic className="h-8 w-8 text-white" />,
  },
  {
    title: "Multilingual Support",
    description: "Seamless conversations in multiple languages",
    details:
      "The AI tour guide speaks and understands multiple languages, ensuring accessibility for a global audience.",
    icon: <Globe className="h-8 w-8 text-white" />,
  },
  {
    title: "Augmented Reality (AR) Integration",
    description: "Enhance your tour with AR overlays",
    details:
      "Experience historical reconstructions, interactive artifacts, and informational pop-ups using augmented reality.",
    icon: <Camera className="h-8 w-8 text-white" />,
  },
  {
    title: "Analytics & User Insights",
    description: "Track engagement and personalize experiences",
    details:
      "Our AI collects insights on user preferences, helping improve future tours and deliver personalized recommendations.",
    icon: <BarChart className="h-8 w-8 text-white" />,
  },
];
