import { FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const NotificationBox = ({ setShake, setNotificationBoxOpen }) => {
  const navigate = useNavigate();
  const onCancel = () => {
    setNotificationBoxOpen(false);
    setShake(false);
  };
  const onAnswer = () => {
    setNotificationBoxOpen(false);
    setShake(false);
    navigate("/additional-details");
  };

  return (
    <div className="flex right-152 top-[52px] items-start gap-4 py-5 px-6 max-w-md bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-lg border border-gray-300 absolute">
      {/* Left: Icon */}
      <div className="p-3 bg-gray-100 text-black-600 rounded-full">
        <FaBell size={18} />
      </div>

      {/* Right: Title & Message */}
      <div className="flex flex-col flex-1 gap-1">
        <div className="text-lg font-semibold text-gray-700">
          Security Questions Not Answered!
        </div>
        <p className="text-base text-gray-600">
          Please answer the security questions.
        </p>

        {/* Buttons */}
        <div className="flex gap-5 mt-2">
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            onClick={onAnswer}
          >
            Answer
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBox;
