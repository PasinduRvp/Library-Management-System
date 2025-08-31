import React from "react";
import { FaBook, FaUsers, FaAward, FaHeart, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import team1 from "../assest/person1.jpeg";
import team2 from "../assest/person1.jpeg";
import team3 from "../assest/person1.jpeg";
import libraryImage from "../assest/person1.jpeg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-800/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-amber-800 mb-6">About BookNest</h1>
            <p className="text-xl text-amber-700 mb-8">
              Where stories come to life and knowledge finds a home
            </p>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-amber-800 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2010, BookNest began as a small community initiative with a simple mission: 
                to make knowledge accessible to everyone. What started as a humble collection of 500 books 
                has now grown into a thriving hub of over 50,000 resources.
              </p>
              <p className="text-gray-700 mb-4">
                Our journey has been guided by the belief that books have the power to transform lives, 
                bridge communities, and spark innovation. We've witnessed countless stories of personal 
                growth, academic achievement, and community connection that began within our walls.
              </p>
              <p className="text-gray-700">
                Today, BookNest stands as a testament to what a community can achieve when it values 
                education, imagination, and the timeless magic of a good book.
              </p>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={libraryImage} 
                  alt="BookNest Library" 
                  className="w-full h-96 object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-amber-800 mb-4">Our Purpose</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              Guided by our core values, we strive to create a welcoming space for all readers and learners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <FaBook className="text-2xl text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To provide free access to information, ideas, and resources that inspire learning, 
                promote literacy, and strengthen our community. We believe every person deserves 
                the opportunity to explore new worlds through reading.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <FaHeart className="text-2xl text-amber-600" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-800 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To create a community where reading is celebrated, knowledge is shared freely, 
                and every individual has the tools they need to succeed. We envision a future 
                where our library serves as the heart of intellectual and cultural life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-amber-800 mb-4">Meet Our Team</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              Passionate individuals dedicated to serving our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="text-center bg-amber-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">{member.name}</h3>
                <p className="text-amber-600 mb-4">{member.role}</p>
                <p className="text-gray-700">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-amber-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-amber-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      
    </div>
  );
};

// Team members data
const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Head Librarian",
    bio: "MLIS graduate with 15 years of experience in community library services.",
    image: team1
  },
  {
    name: "David Chen",
    role: "Digital Resources Manager",
    bio: "Technology enthusiast dedicated to making digital resources accessible to all.",
    image: team2
  },
  {
    name: "Maria Rodriguez",
    role: "Community Outreach Coordinator",
    bio: "Passionate about building bridges between the library and diverse communities.",
    image: team3
  }
];

// Stats data
const stats = [
  { value: "50,000+", label: "Books Available" },
  { value: "10,000+", label: "Active Members" },
  { value: "150+", label: "Weekly Events" },
  { value: "12", label: "Years of Service" }
];

// Testimonials data
const testimonials = [
  {
    text: "BookNest transformed my children's relationship with reading. The children's programs are incredible!",
    name: "Jennifer K.",
    role: "Parent & Member",
    image: team1
  },
  {
    text: "As a student, the resources and quiet study spaces at BookNest have been invaluable to my academic success.",
    name: "Michael T.",
    role: "College Student",
    image: team2
  },
  {
    text: "The staff's knowledge and willingness to help make this library a true community treasure.",
    name: "Robert L.",
    role: "Retired Teacher",
    image: team3
  }
];

export default AboutUs;