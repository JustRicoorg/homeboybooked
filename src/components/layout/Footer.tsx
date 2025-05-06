const Footer = () => {
  return <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img alt="HOMEBOY Barbing Saloon Logo" className="h-16 w-auto mr-3" src="/lovable-uploads/3ba6c13f-8c91-4fee-8ef0-48c06ce50c69.png" />
            </div>
            <p className="text-gray-400">Professional Barbing Saloon providing quality haircuts and styling services.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <address className="text-gray-400 not-italic">
              <p>The Gambia </p>
              <p>Serekunda, Near Newac </p>
              <p className="mt-2">Phone: (220) 345 0445/797 9780</p>
              <p>Email: info@homeboy.com</p>
            </address>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <ul className="text-gray-400">
              <li className="flex justify-between mb-1">
                <span>Monday - Friday:</span>
                <span>9am - 8pm</span>
              </li>
              <li className="flex justify-between mb-1">
                <span>Saturday:</span>
                <span>9am - 6pm</span>
              </li>
              <li className="flex justify-between mb-1">
                <span>Sunday:</span>
                <span>10am - 4pm</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Homeboy Barbing Saloon. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;