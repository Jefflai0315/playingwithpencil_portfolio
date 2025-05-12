import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import Com_1 from '../assets/images/Com_1.jpg';
import Com_2 from '../assets/images/Com_2.jpg';
import Com_3 from '../assets/images/Com_3.jpg';
import Com_4 from '../assets/images/Com_4.jpg';
import Com_5 from '../assets/images/Com_5.jpg';
import Com_6 from '../assets/images/Com_6.jpg';
import emailjs from 'emailjs-com';

import { Link } from 'react-router-dom';
import SocialFeed from '../components/SocialFeed';
import { motion, useScroll, useTransform } from 'framer-motion';


function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
    reference: 'yes'
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: ''
  });

  useEffect(() => {
    // Simulate loading and reveal the grid with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Preview file size validation (max 5MB per file)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      alert('Some files exceed the 5MB limit and were not added.');
    }
    
    // Create preview URLs for valid files
    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
  };
  
  const removePhoto = (index) => {
    const newPhotos = [...uploadedPhotos];
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newPhotos[index].preview);
    newPhotos.splice(index, 1);
    setUploadedPhotos(newPhotos);
  };

  // Function to submit to Google Sheets
  const submitToGoogleSheets = async () => {
     try {
       // 1) convert each File to a base64 blob
       const photoData = await Promise.all(
         uploadedPhotos.map(async (photo) => {
           const base64Data = await convertFileToBase64(photo.file);
           return {
             name: photo.file.name,
             type: photo.file.type,
             base64Data,           // strip out the "data:…;base64," prefix in your helper
           };
         })
       );

       // 2) build the payload with full photo objects
       const formPayload = {
         ...formData,
         photoCount: uploadedPhotos.length,
         photoNames: uploadedPhotos.length
           ? uploadedPhotos.map(p => p.file.name).join(', ')
           : 'None',
         photos: photoData,      // <-- this is new
       };

       // 3) POST to your Apps Script endpoint with proper headers
       const response = await fetch(process.env.REACT_APP_GOOGLE_SHEETS_ENDPOINT, {
         method: 'POST',
         mode: 'no-cors', // Change to no-cors mode
         headers: { 
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(formPayload),
         redirect: 'follow', // Add redirect handling
       });

       // Since we're using no-cors, we can't check response.ok
       // Instead, we'll assume success if we get here
       console.log('Form submitted to Google Sheets successfully');
       return true;
     } catch (error) {
       console.error('Error submitting to Google Sheets:', error);
       // Log more details about the error
       if (error instanceof TypeError) {
         console.error('Network error details:', {
           message: error.message,
           stack: error.stack,
           endpoint: process.env.REACT_APP_GOOGLE_SHEETS_ENDPOINT
         });
       }
       return false;
     }
    };
  
  // Function to submit via email service (EmailJS)
  const submitViaEmail = async () => {
    try {
      // Send the form data in the first email
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        mobile: formData.mobile || 'Not provided',
        reference: formData.reference,
        photo_count: uploadedPhotos.length,
        photo_names: uploadedPhotos.length > 0 
          ? uploadedPhotos.map(p => p.file.name).join(', ') 
          : 'None'
      };

      // Send initial email with form data
      const emailResult = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id',
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id',
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID || 'your_user_id'
      );

      if (emailResult.status !== 200) {
        throw new Error('Email submission failed');
      }


      console.log('Form submitted via email successfully');
      return true;
    } catch (error) {
      console.error('Error submitting via email:', error);
      return false;
    }
  };
  
  // Helper function to convert File to base64 for email attachments
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        setFormStatus({
          submitted: false,
          success: false,
          message: 'Please fill in all required fields'
        });
        setIsSubmitting(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormStatus({
          submitted: false,
          success: false,
          message: 'Please enter a valid email address'
        });
        setIsSubmitting(false);
        return;
      }
      
      // First, try to submit to Google Sheets
      let submissionSuccess = await submitToGoogleSheets();
      
      submissionSuccess = await submitViaEmail();
      
      
      if (submissionSuccess) {
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          mobile: '',
          message: '',
          reference: 'yes'
        });
        
        // Clean up uploaded photos
        uploadedPhotos.forEach(photo => {
          URL.revokeObjectURL(photo.preview);
        });
        setUploadedPhotos([]);
        
        // Set success message
        setFormStatus({
          submitted: true,
          success: true,
          message: 'Your message has been sent! I will get back to you soon.'
        });
      } else {
        // Set error message if both submission methods fail
        setFormStatus({
          submitted: false,
          success: false,
          message: 'Failed to send your message. Please try again or contact me directly.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        submitted: false,
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Clean up object URLs when component unmounts
    return () => {
      uploadedPhotos.forEach(photo => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  const portfolioItems = [
    {
      id: 1,
      image: Com_1,
      sketch: "/path/to/sketch1.jpg",
      title: "A dad passed me his son's photo and asked me to sketch it to his son's birthday.",
      likes: 33,
      comments: 8
    },
    {
        id: 2,
        image: Com_2,
        sketch: "/path/to/sketch1.jpg",
        title: "A teacher's favourite playful student.",
        likes: 33,
        comments: 8
      },
      {
        id: 3,
        image: Com_3,
        sketch: Com_1,
        title: "A mother's favourite son's outfit.",
        likes: 33,
        comments: 8
      },
      {
        id: 4,
        image: Com_4,
        sketch: Com_1,
        title: "A tired vietnamese security guard spotted in a hot afternoon.",
        likes: 33,
        comments: 8
      },
      {
        id: 5,
        image: Com_5,
        sketch: Com_1,
        title: "A handsome and friendly vietnamese massager.",
        likes: 33,
        comments: 8
      },
      {
        id: 6,  
        image: Com_6,
        sketch: Com_1,
        title: "Commissioned by watch shop to sketch their customers.",
        likes: 33,
        comments: 8
      },
    
    // Add more portfolio items...
  ];

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.98]);

  const services = [
    { 
      id: 1, 
      title: "Event Sketches", 
      description: "Live sketching at your events, capturing special moments in real-time.",
      icon: "🎨"
    },
    { 
      id: 2, 
      title: "Portrait Commissions", 
      description: "Custom portraits created with attention to detail and personal style.",
      icon: "👤"
    },
    { 
      id: 3, 
      title: "Live Portrait Events", 
      description: "Interactive portrait sessions at events and gatherings.",
      icon: "🎭"
    },
    {
      id: 4,
      title: "Digital Portraits",
      description: "Modern digital artwork perfect for social media and prints.",
      icon: "💻"
    },
    {
      id: 5,
      title: "Corporate Events",
      description: "Professional sketching services for corporate events and team building.",
      icon: "🏢"
    },
    {
      id: 6,
      title: "Wedding Sketches",
      description: "Capture your special day with beautiful live wedding sketches.",
      icon: "💑"
    }
  ];

  const whatYouGet = [
    {
      id: 1,
      title: "Professional Quality",
      description: "High-quality artwork created with premium materials and attention to detail."
    },
    {
      id: 2,
      title: "Quick Turnaround",
      description: "Fast delivery times without compromising on quality."
    },
    {
      id: 3,
      title: "Digital Copies",
      description: "Receive digital copies of your artwork for easy sharing and printing."
    },
    {
      id: 4,
      title: "Customization",
      description: "Personalized artwork tailored to your specific needs and preferences."
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      text: "Captured my personality perfectly in just 15 minutes! The attention to detail was incredible.",
      service: "Live Event Portrait",
      rating: 5
    },
    {
      id: 2,
      name: "John D.",
      text: "Amazing attention to detail. The portrait exceeded my expectations. Highly recommend!",
      service: "Commission Work",
      rating: 5
    },
    {
      id: 3,
      name: "Emily R.",
      text: "Made our corporate event special with live sketches. Everyone loved their portraits!",
      service: "Corporate Event",
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      rotate: -5
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      rotate: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  // Add clearForm function
  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      message: '',
      reference: 'yes'
    });
    
    // Clean up uploaded photos
    uploadedPhotos.forEach(photo => {
      URL.revokeObjectURL(photo.preview);
    });
    setUploadedPhotos([]);
    
    // Reset form status
    setFormStatus({
      submitted: false,
      success: false,
      message: ''
    });
  };

  return (
    <div className="w-full mx-auto transition-opacity duration-1000">
      {/* Portfolio Section - Now at the top */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Moments I Sketched
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Each portrait tells a unique story captured in time. Interested in your own custom sketch?
            </motion.p>
            <motion.button 
              onClick={() => setIsContactOpen(true)}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">✏️</span>
              Commission a Sketch
            </motion.button>
          </motion.div>

          {/* Portfolio Grid - Horizontal Scroll */}
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex space-x-4 py-4"
              animate={{
                x: [0, -1000, 0],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              {[...portfolioItems, ...portfolioItems].map((item, index) => (
                <motion.div 
                  key={`${item.id}-${index}`}
                  className="flex-none w-64 aspect-square"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ease-out group cursor-pointer"> 
                    <img 
                      src={item.image} 
                      alt="Portrait" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-x-0 bottom-0 p-3 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
                      <p className="text-white text-sm font-medium line-clamp-2">{item.title}</p>
                      <div className="flex items-center text-xs text-white/80 mt-1">
                        <span className="flex items-center mr-3">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                          {item.likes}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path></svg>
                          {item.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hero Section - Now below portfolio */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity, scale }}
        >
          <img
            src="/CaptureMoment.png"
            alt="Portrait Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        </motion.div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-lg"
            >
              Capturing Your Perfect Moments
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-6 text-xl text-white max-w-3xl mx-auto drop-shadow-lg"
            >
              Professional portrait artist specializing in live events, commissions, and digital artwork.
              Let me help you create lasting memories.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-10 flex justify-center space-x-4"
            >
              <Link
                to="/booking"
                className="group relative inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 hover:bg-gray-100 transition-all duration-300 overflow-hidden shadow-lg"
              >
                <span className="relative z-10">Book Your Session</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </Link>
              <Link
                to="/platinum-experience"
                className="group relative inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-all duration-300 shadow-lg"
              >
                <span className="relative z-10">Learn More</span>
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating action button for mobile */}
      <button 
        onClick={() => setIsContactOpen(true)}
        className="fab-commission"
        aria-label="Commission a sketch"
      >
        <span className="fab-icon">✏️</span>
      </button>

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="contact-modal-overlay" onClick={() => !formStatus.submitted && setIsContactOpen(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            {!formStatus.submitted ? (
              <>
                <div className="contact-modal-header">
                  <h2>Commission a Custom Portrait</h2>
                  <button className="contact-close-btn" onClick={() => setIsContactOpen(false)}>×</button>
                </div>
                <div className="contact-modal-body">
                  <div className="contact-info">
                    <p>I'd love to create a custom sketch for you. Please share some details about what you have in mind.</p>
                    <div className="sketch-samples">
                      <div className="sample-tag">Portrait</div>
                      <div className="sample-tag">Family</div>
                      <div className="sample-tag">Pet</div>
                      <div className="sample-tag">Couple</div>
                      <div className="sample-tag">Custom</div>
                    </div>
                  </div>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input 
                        type="tel" 
                        id="mobile" 
                        name="mobile" 
                        value={formData.mobile} 
                        onChange={handleInputChange}
                        required
                        placeholder="+65 9888 8888"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">What would you like sketched?</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange}
                        required
                        placeholder="Please describe what you'd like me to sketch..."
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Do you have a reference photo?</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            name="reference" 
                            value="yes" 
                            checked={formData.reference === 'yes'} 
                            onChange={handleInputChange}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="radio-label">
                          <input 
                            type="radio" 
                            name="reference" 
                            value="no"
                            checked={formData.reference === 'no'} 
                            onChange={handleInputChange}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                    
                    {formData.reference === 'yes' && (
                      <div className="form-group">
                        <label>Upload Reference Photos (Max 5MB each)</label>
                        <div className="file-upload-container">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                          />
                          <button 
                            type="button" 
                            className="file-upload-btn"
                            onClick={() => fileInputRef.current.click()}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Select Photos
                          </button>
                          <span className="file-upload-info">You can upload multiple photos</span>
                        </div>
                        
                        {uploadedPhotos.length > 0 && (
                          <div className="photo-preview-container">
                            {uploadedPhotos.map((photo, index) => (
                              <div key={index} className="photo-preview">
                                <img src={photo.preview} alt={`Preview ${index}`} />
                                <button 
                                  type="button" 
                                  className="remove-photo-btn"
                                  onClick={() => removePhoto(index)}
                                >
                                  ×
                                </button>
                                <span className="photo-name">{photo.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {formStatus.error && (
                      <div className="error-message">
                        {formStatus.message}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>{formStatus.message}</p>
                <button 
                  onClick={() => {
                    setIsContactOpen(false);
                    clearForm();
                  }}
                  className="close-button"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services Section with Cards */}
      <motion.div 
        className="py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Our Services
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Choose from our range of professional portrait services designed to capture your unique story
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <motion.div 
                key={service.id} 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div 
                    className="text-5xl mb-6"
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 10,
                      transition: { type: "spring", stiffness: 200 }
                    }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-4 text-base text-gray-500">
                    {service.description}
                  </p>
                  {/* <Link
                    to="/contact"
                    className="mt-6 inline-flex items-center text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Learn more
                    <motion.svg 
                      className="ml-2 w-4 h-4"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                  </Link> */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* What You Get Section with Icons */}
      <motion.div 
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              What You Get
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              Experience the difference with our premium portrait services
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whatYouGet.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotate: -2,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-4 text-base text-gray-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section with Cards */}
      <motion.div 
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Client Feedback
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
              See what our clients have to say about their experience
            </p>
          </motion.div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id} 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <motion.div 
                    className="flex items-center mb-6"
                    whileHover={{ scale: 1.1 }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span 
                        key={i} 
                        className="text-yellow-400 text-xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        ★
                      </motion.span>
                    ))}
                  </motion.div>
                  <p className="text-lg text-gray-600 italic">"{testimonial.text}"</p>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.service}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Social Feed Section */}
      <SocialFeed platform="instagram" />

      {/* CTA Section with Gradient */}
      <motion.div 
        className="relative bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 mix-blend-multiply"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            variants={itemVariants}
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-indigo-400">Book your session today.</span>
            </h2>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          >
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/booking"
                className="group relative inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Book Now</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              {/* <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 hover:bg-gray-50 transition-all duration-300"
              >
                <span className="relative z-10">Contact Us</span>
                <motion.div 
                  className="absolute inset-0 bg-gray-50"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
              </Link> */}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LandingPage; 