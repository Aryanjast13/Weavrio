import { BsInstagram, BsTwitterX } from "react-icons/bs";
import { FaMeta } from "react-icons/fa6";

const TopBar = () => {
  return (
    <div className="bg-primary text-white">
      <div className="container mx-auto flex-between py-3 px-4">
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <FaMeta className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <BsInstagram className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <BsTwitterX className="w-5 h-4" />
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
          <span>We ship worldwide- Fast and reliable shipping</span>
        </div>
        <div className="hidden md:block">
          <a href="tel:+1234567890" className="hover:text-gray-300">
            +1 (234) 567-890
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
