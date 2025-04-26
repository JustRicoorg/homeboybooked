
import React from 'react';

const Map = () => {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5554245733237!2d-16.675833!3d13.438333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec29c3d46b3a8a7%3A0x7c8db7a8483a33e2!2sHomeboy%20Barbing%20Saloon!5e0!3m2!1sen!2s!4v1708929439607!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      ></iframe>
    </div>
  );
};

export default Map;
