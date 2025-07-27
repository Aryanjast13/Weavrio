import { FiPhoneCall } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0 ">
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off on your first order
          </p>
          {/* Newsletter form  */}
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border-y border-l border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
            <button
              type="button"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md  hover:bg-gray-800  transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Men's top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Men's top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Men's top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Men's top Wear
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-600 transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* {Follow us} */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noonpener noreferrer"
              className="hover:text-gray-400"
            >
              <TbBrandMeta className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noonpener noreferrer"
              className="hover:text-gray-400"
            >
              <IoLogoInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noonpener noreferrer"
              className="hover:text-gray-400"
            >
              <RiTwitterLine className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            0123-456-789
          </p>
        </div>
        {/* Footer bottom */}
      </div>
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">
          © 2025, Weavrio. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
