import React, { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import Com_1 from '../assets/images/Com_1.jpg';
import Com_2 from '../assets/images/Com_2.jpg';
import Com_3 from '../assets/images/Com_3.jpg';
import Com_4 from '../assets/images/Com_4.jpg';
import Com_5 from '../assets/images/Com_5.jpg';
import Com_6 from '../assets/images/Com_6.jpg';
import emailjs from 'emailjs-com';


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

       // 3) POST to your Apps Script endpoint (no other changes here)
       const response = await fetch(process.env.REACT_APP_GOOGLE_SHEETS_ENDPOINT, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formPayload),
       });
       if (!response.ok) throw new Error('Google Sheets submission failed');
       return true;
     } catch (error) {
       console.error('Error submitting to Google Sheets:', error);
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
      
      // If Google Sheets submission fails, try email as backup
      if (!submissionSuccess) {
        submissionSuccess = await submitViaEmail();
      }
      
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

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-700">
            Moments I sketched.
          </p>
          <p className="mt-2 text-gray-500 max-w-2xl">
            Each portrait tells a unique story captured in time. Interested in your own custom sketch?
          </p>
        </div>
        <button 
          onClick={() => setIsContactOpen(true)}
          className="commission-button mt-4 md:mt-0"
        >
          <span className="commission-icon">✏️</span>
          <span>Commission a Sketch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolioItems.map((item, index) => (
          <div key={item.id} className={`animate-fade-in-up animation-delay-${index % 6}`}>
            <div className="relative portrait-container bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ease-out group cursor-pointer portrait-item"> 
              <img 
                src={item.image} 
                alt="Portrait" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
                <p className="text-white text-sm font-medium mb-2">{item.title}</p>
                <div className="flex items-center text-xs text-white/80">
                  <span className="flex items-center mr-3">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path></svg>
                    {item.likes}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path></svg>
                    {item.comments}
                  </span>
                </div>
              </div>
              <div className="absolute top-0 right-0 m-2 bg-white/80 rounded-full p-1 transform rotate-0 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage; 