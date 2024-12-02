const CallInfo = ({
  phone = "702-55-1212",
  location = "Las Vegas, Nevada",
  timestamp = "00:49",
  isDarkMode = false, // Prop to toggle dark mode
}) => {
  // Dynamic classes for dark/light mode
  const bgColor = isDarkMode ? "bg-s1" : "bg-white";
  const timestampColor = isDarkMode ? "text-orange-400" : "text-orange-500";
  const borderColor = isDarkMode ? "border-p1" : "border-p1/10";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";
  const inputBorderColor = isDarkMode ? "border-gray-600" : "border-gray-300";

  return (
    <div className={`p-4 rounded-xl h-full border-2 ${bgColor} ${borderColor}`}>
      <p className={`text-sm font-semibold ${labelColor}`}>Call Info</p>
      <div className="flex flex-col justify-center text-center h-full">
        <h2 className={`text-l md:text-2xl font-bold ${textColor}`}>{phone}</h2>
        <p className={`text-sm ${labelColor}`}>{location}</p>
        <p className={`text-sm font-semibold ${timestampColor}`}>{timestamp}</p>
      </div>
    </div>
  );
};

export default CallInfo;