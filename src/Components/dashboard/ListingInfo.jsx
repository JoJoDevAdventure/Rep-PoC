const ListingInfo = ({ call, onFieldEdit, onEndCall, onSave, isDarkMode }) => {
  if (!call) return <p>No call selected</p>; // Handle empty call object

  // Dynamic text colors based on the mode
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const labelColor = isDarkMode ? "text-gray-400" : "text-gray-500";
  const inputBorderColor = isDarkMode ? "border-gray-600" : "border-gray-300";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: "First Name", key: "clientInfo.firstName" },
          { label: "Last Name", key: "clientInfo.lastName" },
          { label: "Email", key: "clientInfo.email" },
          { label: "Phone Number", key: "clientInfo.phone" },
        ].map((field) => (
          <div key={field.key}>
            <p className={`text-xs ${labelColor}`}>{field.label}</p>
            <input
              type="text"
              value={field.key.split(".").reduce((o, k) => (o || {})[k], call) || ""}
              onChange={(e) => onFieldEdit(field.key, e.target.value)}
              className={`w-full text-sm rounded px-3 py-2 ${textColor} ${inputBorderColor} border ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Listing Info Section */}
      <p className={`text-sm font-semibold mb-4 ${labelColor}`}>Listing Info</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Street Address", key: "propertyInfo.address" },
          { label: "City", key: "propertyInfo.city" },
          { label: "State", key: "propertyInfo.state" },
          { label: "ZIP", key: "propertyInfo.zip" },
          { label: "Surface", key: "propertyInfo.surface" },
          { label: "Nº of Rooms", key: "propertyInfo.rooms" },
          { label: "Nº of Bathrooms", key: "propertyInfo.bathrooms" },
        ].map((field) => (
          <div key={field.key}>
            <p className={`text-xs ${labelColor}`}>{field.label}</p>
            <input
              type="text"
              value={field.key.split(".").reduce((o, k) => (o || {})[k], call) || ""}
              onChange={(e) => onFieldEdit(field.key, e.target.value)}
              className={`w-full text-sm rounded px-3 py-2 ${textColor} ${inputBorderColor} border ${
                isDarkMode ? "bg-gray-700" : "bg-white"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <p className={`text-sm font-semibold mb-2 ${labelColor}`}>Notes</p>
        <textarea
          value={call.notes || ""}
          onChange={(e) => onFieldEdit("notes", e.target.value)}
          className={`w-full text-sm rounded px-3 py-2 ${textColor} ${inputBorderColor} border ${
            isDarkMode ? "bg-gray-700" : "bg-white"
          }`}
          placeholder="Add notes here..."
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

export default ListingInfo;