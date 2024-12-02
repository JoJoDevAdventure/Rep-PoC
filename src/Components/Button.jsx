import clsx from "clsx";
import Marker from "./Marker";

const Button = ({
  icon,
  children,
  href,
  containerClassName,
  onClick,
  markerFill,
}) => {
  const Inner = () => (
    <>
      <span className="relative hover:bg-black flex items-center min-h-[60px] px-4 g4 inner-before rounded-2xl hover:before:opacity-100 overflow-hidden w-full">
        <span className="absolute -left-[1px]">
          <Marker markerFill={markerFill} />
        </span>
        {icon && (
          <img
            src={icon}
            alt="circle"
            className="size-10 mr-5 object-contain z-10"
          />
        )}
        <span className="relative z-2 font-poppins base-bold text-p1">
          {children}
        </span>
      </span>
      <span className="glow-before glow-after"/>
    </>

  );

  return href ? (
    <a
      href={href}
      className={clsx(
        "relative p-0.5 g5 rounded-2xl shadow-500 group cursor-pointer w-full",
        containerClassName
      )}
    >
      <Inner />
    </a>
  ) : (
    <button
      className={clsx(
        "relative p-0.5 g5 rounded-2xl shadow-500 group cursor-pointer w-full",
        containerClassName
      )}
      onClick={onClick}
    >
      <Inner />
    </button>
  );
};

export default Button;
