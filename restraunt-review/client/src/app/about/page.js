"use client";
import { motion } from "framer-motion";
import Particles from "../../components/ui/particles";

const About = () => {
  return (
    <main className="relative min-h-screen flex flex-col pt-16 bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in opacity-50"
        quantity={100}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex flex-col"
      >
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-teal-400">
            About Bite-Check
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted platform for discovering and sharing authentic food
            experiences
          </p>
        </motion.header>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Statement */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300"
            >
              <h2 className="text-3xl font-semibold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We believe everyone deserves access to honest, reliable
                restaurant reviews. Our platform connects food enthusiasts with
                authentic dining experiences, helping you make informed
                decisions about where to eat next.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300"
            >
              <h2 className="text-3xl font-semibold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
                What We Offer
              </h2>
              <ul className="space-y-4 text-gray-600 text-lg">
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-2xl">🌟</span>
                  Authentic user reviews and ratings
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-2xl">🔍</span>
                  Easy restaurant discovery
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-2xl">📸</span>
                  Photo sharing capabilities
                </li>
                <li className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <span className="mr-3 text-2xl">🤝</span>
                  Community-driven insights
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16 text-center"
          >
            <h2 className="text-4xl font-semibold mb-10 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Garv Saini",
                  role: "2210990315", 
                  description:
                    "3rd year CS student passionate about full-stack development and food tech",
                },
                {
                  name: "Gaurav Rana",
                  role: "2210990330",
                  description: 
                    "3rd year CS student focused on UI/UX design and web development",
                },
                {
                  name: "Dipanshu Saini",
                  role: "2210990288",
                  description:
                    "3rd year CS student specializing in backend development and databases",
                },
                {
                  name: "Dhruv Walia",
                  role: "2210990280",
                  description:
                    "3rd year CS student interested in cloud computing and system architecture",
                },
                {
                  name: "Divyan rai",
                  role: "2210990295", 
                  description:
                    "3rd year CS student passionate about full-stack development and food tech",
                }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.2 }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mt-2 text-lg">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {member.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
};

export default About;
