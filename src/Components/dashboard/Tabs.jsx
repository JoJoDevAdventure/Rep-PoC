
import { useTheme } from "@/app/context/themeContext";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
    const { isDarkMode } = useTheme();
  return (
    <div className="flex border-b border-p1/10 justify-between md:justify-start">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`md:px-6 py-2 w-full md:w-auto ${
            activeTab === index
              ? "border-orange-500 text-orange-500 border-b-2"
              : isDarkMode ? "text-p4":"text-gray-500"
          }`}
          onClick={() => setActiveTab(index)}
        >
          <p className="md:text-[18px] text-[12px]">{tab}</p>
        </button>
      ))}
    </div>
  );
};

export default Tabs;