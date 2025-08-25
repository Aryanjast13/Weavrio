import redwhite from "../../assets/filter/filter_color10.webp";
import greenBlue from "../../assets/filter/filter_color12.webp";
import denimBlue from "../../assets/filter/filter_color13.webp";
import skyBlueWhite from "../../assets/filter/filter_color14.webp";
import peachWhite from "../../assets/filter/filter_color15.webp";
import nilacBlack from "../../assets/filter/filter_color16.webp";
import neonDarkGreen from "../../assets/filter/filter_color17.webp";
import redOffWhite from "../../assets/filter/filter_color18.webp";
import blackGrey from "../../assets/filter/filter_color19.webp";
import navyMaroon from "../../assets/filter/filter_color20.webp";
import redBlack from "../../assets/filter/filter_color21.webp";
import purpleNilac from "../../assets/filter/filter_color6.webp";
import blackWhite from "../../assets/filter/filter_color7.webp";
import greenGrey from "../../assets/filter/filter_color8.webp";
import offWhiteYellow from "../../assets/filter/filter_color9.webp";






import { useFilterSidebar } from "../../hooks/useFilterSidebar";

 const categories = ["Top Wear", "Bottom Wear"];

const colors = [
  { name: "Beige", value: "#FDF3D7", number: 5 },
  { name: "Black", value: "#000101", number: 52 },
  { name: "BLACK", value: "#000101", number: 3 },
  { name: "Black-White", value: "", image: blackWhite, number: 1 },
  { name: "Black-Acidwash", value: "", number: 1 },
  { name: "Black-Grey", value: "", image: blackGrey, number: 2 },
  { name: "Bottle-Green", value: "#406a4f", number: 1 },
  { name: "Coffee-Brown", value: "", number: 2 },
  { name: "Coral-Haze", value: "#e59697", number: 6 },
  { name: "Cream", value: "#fffad1", number: 4 },
  { name: "Denim-Blue", value: "", image: denimBlue, number: 1 },
  { name: "Denim-Blue - White", value: "", number: 2 },
  { name: "Grapeade", value: "#6c5064", number: 2 },
  { name: "Green", value: "#4f8312", number: 2 },
  { name: "Green-Blue", value: "", image: greenBlue, number: 1 },
  { name: "Grey-Green", value: "", image: greenGrey, number: 1 },
  { name: "Hazzle-Nut", value: "#af9e80", number: 2 },
  { name: "Light-Plum", value: "#9d5682", number: 1 },
  { name: "Light-Salmon", value: "#ffffff", number: 1 },
  { name: "Lilac", value: "#cdcbdc", number: 9 },
  { name: "Maroon", value: "#833b4e", number: 2 },
  { name: "Military-Green", value: "#4b5221", number: 2 },
  { name: "Mint", value: "#9ee2cd", number: 15 },
  { name: "Multi", value: "", number: 3 },
  { name: "Multi-Color", value: "", number: 60 },
  { name: "Navy-Maroon", value: "", image: navyMaroon, number: 1 },
  { name: "Navy-Blue", value: "#1e3655", number: 12 },
  { name: "Neon-Dark Green", value: "", image: neonDarkGreen, number: 1 },
  { name: "Nilac", value: "#c8a2c8", number: 2 },
  { name: "Nilac-Black", value: "", image: nilacBlack, number: 1 },
  { name: "OffWhite", value: "", number: 4 },
  { name: "OffWhite-Red", value: "", number: 1 },
  { name: "OffWhite-Yellow", value: "", image: offWhiteYellow, number: 1 },
  { name: "Olive-Green", value: "", number: 4 },
  { name: "Peach-White", value: "", image: peachWhite, number: 2 },
  { name: "Peach-Fuzz", value: "", number: 5 },
  { name: "Purple", value: "", number: 3 },
  { name: "Purple-Nilac", value: "", image: purpleNilac, number: 2 },
  { name: "Quick-Sand", value: "", number: 3 },
  { name: "Red", value: "", number: 3 },
  { name: "Red&Olive Green", value: "", number: 1 },
  { name: "Red-Black", value: "", image: redBlack, number: 2 },
  { name: "Red-Off White", value: "", image: redOffWhite, number: 1 },
  { name: "Red-White", value: "", image: redwhite, number: 4 },
  { name: "River-Blue", value: "", number: 1 },
  { name: "River-Side", value: "#677c9d", number: 2 },
  { name: "Sap-Green", value: "#bfcfa9", number: 2 },
  { name: "Sky-Blue", value: "#bdd7f5", number: 7 },
  { name: "SkyBlue-White", value: "", image: skyBlueWhite, number: 2 },
  { name: "Steel-Grey", value: "#9c9d9d", number: 7 },
  { name: "Taupe", value: "#dbc19e", number: 8 },
  { name: "Tie-Dye", value: "", number: 8 },
  { name: "White", value: "", number: 21 },
  { name: "Yellow", value: "#f7b819", number: 2 },
];



 const sizes = ["XS", "S", "M", "L", "XL", "XXL"];




const FilterSidebar = () => {
  const {handleButtonClick,handleFilterChange,handlePriceChange,filters ,priceRange} = useFilterSidebar();
  
  return (
    <div className="py-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

      {/* Category Filter
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div> */}
      {/* 
      {/* Gender Filter 
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div> */}

      {/* Color Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-col gap-3 h-52 overflow-y-scroll w-48 ">
          {colors.map((color) => (
            <div className="flex gap-2 items-center group">
              <button
                key={color.name}
                name="color"
                value={color.name}
                onClick={() => handleButtonClick(color.name)}
                className={`h-7 w-7 rounded-full border-2 overflow-hidden cursor-pointer transition hover:scale-105 ${
                  filters.color.includes(color.name)
                    ? "ring-2 border-[#67b084]"
                    : "border-gray-300 group-hover:border-gray-700 "
                }`}
                style={{ backgroundColor: color.value }}
              >
                {color.image ? <img className="w-full h-full object-cover" src={color.image} alt="" /> : null}
              </button>
              <p>
                {color.name} {`(${color.number})`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* size filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2 ">Size</label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              checked={filters.size.includes(size)}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={3000}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>₹0</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar