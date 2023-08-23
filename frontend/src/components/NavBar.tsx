import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

interface NavBarProps {
  onExportClick: () => void; // Function to handle the export
}

const NavBar: React.FC<NavBarProps> = ({ onExportClick }) => {
  return (
    <div className="px-5 flex md:grid md:grid-cols-4 w-full bg-[#004b34] h-20 text-white">
      {/* Logo */}
      <div className="flex justify-center items-center hidden md:flex">
        <img src="/viclogo.png" alt="Logo" className="max-w-[150px] mr-auto" />
      </div>
      {/* Text */}
      <div className="flex justify-center items-center col-span-2">
        <h1 className="text-center text-2xl md:text-3xl">Course Visualiser</h1>
      </div>
      {/* Export Button */}
      <button onClick={onExportClick} className="flex justify-center items-center ml-auto">
        Export <FontAwesomeIcon icon={faFileExport} className="ml-2" />
      </button>
    </div>
  );
};

export default NavBar;
