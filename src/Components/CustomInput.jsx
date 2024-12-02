import clsx from "clsx";
import { useState } from "react";

const CustomInput = ({
  placeholder,
  type = "text",
  containerClassName,
  inputClassName,
  onChange,
  value,
  name,
  required,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  return (
    <>
      <div
        className={clsx(
          "relative bg-black flex items-center min-h-[60px] px-4 g4 inner-before rounded-2xl overflow-hidden border-[1px] border-p2 glow-before_input glow-after_input transition-all duration-500 w-full",
          isActive && "before:opacity-100 glow-after_input_active glow-before_input_active g7",
          containerClassName
        )}
      >
        <input
          className={clsx(
            "relative z-2 font-poppins base-bold text-p1 px-4 py-3 rounded-2xl w-full bg-transparent outline-none",
            isActive && "",
            inputClassName
          )}
          type={type}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          value={value}
          name={name}
          required={required}
        />
      </div>
    </>
  );
};

export default CustomInput;
