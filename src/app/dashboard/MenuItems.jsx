import { appState } from "@/appState"; // Import appState for language preference

const MenuItems = ({ menuItems, onSelect, isDarkMode }) => {
  // Define dynamic classes for dark/light mode
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700"; // Adjust text color
  const bgColor = isDarkMode ? "bg-s1" : "bg-white"; // Adjust background color
  const borderColor = isDarkMode ? "border-p1/30" : "border-p1/10"; // Adjust border color

  // Determine the language preference
  const isEnglish = appState.isEnglish;

  return (
    <div className={`w-full md:p-4 grid md:grid-cols-4 gap-6 ${bgColor}`}>
      {menuItems.map((item, index) => {
        // Get content based on language preference
        const content = isEnglish ? item.eng : item.esp;

        return (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className={`rounded-lg border ${borderColor} shadow-md p-4 flex flex-col md:flex-col items-start md:items-center gap-4 ${
              isDarkMode ? "hover:bg-p1/10" : "hover:bg-p1/10"
            } cursor-pointer`}
          >
            {/* Image Section */}
            <div className="w-full">
              <img
                src={item.image}
                alt={content.title}
                className="rounded-lg w-full h-[200px] md:h-[150px] object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="flex-1">
              {/* Title */}
              <h3 className={`text-lg font-bold ${textColor}`}>{content.title}</h3>
              {/* Description */}
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>
                {content.description}
              </p>
              {/* Price */}
              <p className={`text-md font-semibold mt-4 ${textColor}`}>
                {item.price?.formatted || item.price || content.price}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuItems;