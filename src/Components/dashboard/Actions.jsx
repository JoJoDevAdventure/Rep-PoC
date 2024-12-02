const Actions = ({ onEndCall, onSave }) => {
  return (
    <div className="flex justify-between mt-4">
      {/* End Call Button */}
      <button
        onClick={onEndCall} // Trigger the onEndCall callback when clicked
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" // Styling for the "End Call" button
      >
        End Call
      </button>

      {/* Save Info Button */}
      <button
        onClick={onSave} // Trigger the onSave callback when clicked
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600" // Styling for the "Save Info" button
      >
        Save Info
      </button>
    </div>
  );
};

export default Actions;