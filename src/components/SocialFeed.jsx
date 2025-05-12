import { useState, useEffect } from 'react';

const SocialFeed = () => {
  const [loading, setLoading] = useState(true);

  const instagramPosts = [
    {
      id: 1,
      url: 'https://www.instagram.com/p/DI5XQxHhRo7',
      embedUrl: 'https://www.instagram.com/p/DI5XQxHhRo7/embed',
      caption: 'Live sketching at events'
    },
    {
      id: 2,
      url: 'https://www.instagram.com/p/DIVIpDzBPw-/',
      embedUrl: 'https://www.instagram.com/p/DIVIpDzBPw-/embed',
      caption: 'Portrait commissions'
    },
    {
      id: 3,
      url: 'https://www.instagram.com/p/DFy5vTLS8pE/',
      embedUrl: 'https://www.instagram.com/p/DFy5vTLS8pE/embed',
      caption: 'Behind the scenes'
    }
  ];

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Follow Me on Instagram
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Check out my latest work and behind-the-scenes moments
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {instagramPosts.map((post) => (
            <div key={post.id} className="rounded-lg shadow-lg overflow-hidden">
              <div className="relative" style={{ paddingBottom: '177.77%' }}> {/* 16:9 aspect ratio */}
                <iframe
                  src={post.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency="true"
                  allow="encrypted-media"
                  title={`Instagram post ${post.id}`}
                  style={{ maxHeight: '100%' }}
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/playingwithpencil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Follow Me on Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed; 