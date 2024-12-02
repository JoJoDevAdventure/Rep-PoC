const LiveListingInfo = ({
    call,
    onFieldEdit,
    onEndCall,
    onSave,
    currentTimestamp,
    isDarkMode,
  }) => {
    if (!call) return <p>No call selected</p>; // Handle empty call object
  
    // Helper to check if the timestamp is reached
    const isTimestampReached = (fieldTimestamp) => {
      const [currentMin, currentSec] = currentTimestamp.split(":").map(Number);
      const [fieldMin, fieldSec] = fieldTimestamp.split(":").map(Number);
      return currentMin * 60 + currentSec >= fieldMin * 60 + fieldSec;
    };
  
    // Dynamic text and border colors
    const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
    const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    const inputBorderColor = (isHighlighted) =>
      isHighlighted
        ? "border-p1"
        : isDarkMode
        ? "border-gray-600"
        : "border-gray-300";
  
    return (
      <div
        className={`p-6 border-2 rounded-xl ${
          isDarkMode ? "bg-s1 border-p1" : "bg-white border-p1/10"
        }`}
      >
        {/* Client Info Section */}
        <div className="flex justify-between items-center mb-4">
          <p className={`text-sm font-semibold ${labelColor}`}>Client Info</p>
          <button
            onClick={() => console.log("Viewing listing")}
            className={`flex items-center gap-2 text-orange-500 text-sm font-medium border border-orange-500 px-3 py-1 rounded-lg hover:bg-orange-100 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            }`}
          >
            <span>View Listing</span>
          </button>
        </div>
  
        {/* Client Info Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "First Name", key: "clientInfo.firstName", timestamp: "00:16" },
            { label: "Last Name", key: "clientInfo.lastName", timestamp: "00:16" },
            { label: "Email", key: "clientInfo.email", timestamp: "00:28" },
            { label: "Phone Number", key: "clientInfo.phone", timestamp: "00:00" },
          ].map((field) => {
            const value = isTimestampReached(field.timestamp)
              ? field.key.split(".").reduce((o, k) => (o || {})[k], call).value
              : ""; // Empty if timestamp not reached
            const isHighlighted = Boolean(value);
  
            return (
              <div key={field.key}>
                <p className={`text-xs ${labelColor}`}>{field.label}</p>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onFieldEdit(field.key, e.target.value)}
                  className={`w-full text-sm rounded px-3 py-2 ${textColor} ${inputBorderColor(
                    isHighlighted
                  )} border ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
                  readOnly={!isTimestampReached(field.timestamp)} // Disable editing before timestamp
                />
              </div>
            );
          })}
        </div>
  
        {/* Listing Info Section */}
        <p className={`text-sm font-semibold mb-4 ${labelColor}`}>Listing Info</p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Is Currently Listed",
              key: "propertyInfo.currentlyListed",
              timestamp: "00:46",
            },
            {
              label: "Property Type",
              key: "propertyInfo.propretyType",
              timestamp: "00:51",
            },
            { label: "Street Address", key: "propertyInfo.address", timestamp: "00:58" },
            { label: "City", key: "propertyInfo.city", timestamp: "00:59" },
            { label: "State", key: "propertyInfo.state", timestamp: "00:59" },
            { label: "ZIP", key: "propertyInfo.zip", timestamp: "01:05" },
            { label: "Surface", key: "propertyInfo.surface", timestamp: "01:14" },
            { label: "Nº of Rooms", key: "propertyInfo.rooms", timestamp: "01:14" },
            { label: "Nº of Bathrooms", key: "propertyInfo.bathrooms", timestamp: "01:14" },
          ].map((field) => {
            const value = isTimestampReached(field.timestamp)
              ? field.key.split(".").reduce((o, k) => (o || {})[k], call).value
              : ""; // Empty if timestamp not reached
            const isHighlighted = Boolean(value);
  
            return (
              <div key={field.key}>
                <p className={`text-xs ${labelColor}`}>{field.label}</p>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onFieldEdit(field.key, e.target.value)}
                  className={`w-full text-sm rounded px-3 py-2 ${textColor} ${inputBorderColor(
                    isHighlighted
                  )} border ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
                  readOnly={!isTimestampReached(field.timestamp)} // Disable editing before timestamp
                />
              </div>
            );
          })}
        </div>
  
        {/* Notes Section */}
        <div className="mb-6">
          <p className={`text-sm font-semibold mb-2 ${labelColor}`}>Notes</p>
          <textarea
            value={isTimestampReached("02:00") ? call.notes : ""}
            onChange={(e) => onFieldEdit("notes", e.target.value)}
            className={`w-full text-sm rounded px-3 py-2 ${textColor} ${inputBorderColor(
              isTimestampReached("02:00")
            )} border ${isDarkMode ? "bg-gray-700" : "bg-white"}`}
            placeholder="Add notes here..."
            readOnly={!isTimestampReached("02:00")} // Disable editing before timestamp
          ></textarea>
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onEndCall}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            End Call
          </button>
          <button
            onClick={onSave}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Save Info
          </button>
        </div>
      </div>
    );
  };
  
  export default LiveListingInfo;