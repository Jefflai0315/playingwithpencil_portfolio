import { Link } from 'react-router-dom';
import Stories from '../components/Stories';
import Feed from '../components/Feed';
import { motion } from 'framer-motion';

const PlatinumExperience = () => {
  const features = [
    {
      id: 1,
      title: "Live Portrait Sketching",
      description: "Professional live sketching service that captures your guests' personalities in unique, hand-drawn portraits.",
      icon: "✏️"
    },
    {
      id: 2,
      title: "Customized Sketching Booth",
      description: "Personalized setup with branded elements and comfortable seating for an engaging guest experience.",
      icon: "🎨"
    },
    {
      id: 3,
      title: "Social Media Content",
      description: "Professional video content capturing the event highlights and guest reactions for your social media platforms.",
      icon: "📱"
    },
    {
      id: 4,
      title: "Surprise Elements",
      description: "Special touches like custom frames, branded packaging, and surprise reveals to enhance the guest experience.",
      icon: "🎁"
    },
    {
      id: 5,
      title: "Custom Branding",
      description: "Personalized artwork incorporating your brand elements, colors, and messaging into each sketch.",
      icon: "✨"
    },
    {
      id: 6,
      title: "Digital Gallery",
      description: "Easy access to all event photos and videos through a private online gallery for sharing and downloading.",
      icon: "💻"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-50"
            src="/path-to-your-hero-image.jpg"
            alt="Live Portrait Sketching Experience"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Live Portrait Sketching Experience
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-xl text-white max-w-3xl"
          >
            Elevate your corporate events and promotions with our premium live portrait sketching service. 
            Create lasting memories and unique engagement opportunities for your guests through personalized artwork.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            {/* <Link
              to="/contact"
              className="inline-block bg-gray-900 px-8 py-3 border border-transparent text-base font-medium rounded-md text-white hover:bg-gray-800 transition-all duration-300"
            >
              Get in Touch
            </Link> */}
          </motion.div>
        </div>
      </div>

      {/* Portfolio Feed Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Recent Work
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Take a look at some of our recent portrait sessions and commissioned artwork
            </p>
          </motion.div>
          <Feed />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What's Included
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Experience the ultimate in live portrait sketching with our comprehensive service package
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Your Event Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Book Your Event
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Customized packages available for corporate events
            </p>
            <p className="mt-2 text-base text-gray-500 max-w-2xl mx-auto">
              Let's discuss how we can create a unique experience for your next corporate event, product launch, or brand activation
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlatinumExperience; 