import React from "react";
import Image from "next/image";

// 통합된 Button Prop 타입 정의
interface ButtonProps {
  label?: string; 
  disabled?: boolean; 
  imgSrc?: string; 
  imgAlt?: string; 
  isSelected?: boolean;
  onClick?: () => void; 
  onMouseEnter?: () => void; 
  onMouseLeave?: () => void;
  type?: "button" | "submit" | "reset"; // 버튼 타입
  variant?: "select" | "next" | "create" | "cancel" | "save"; 
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  label = "",
  disabled = false,
  imgSrc,
  imgAlt = "icon",
  isSelected = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  type = "button",
  variant = "create",
  iconPosition = "right",
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case "select":
        return `rounded-full ${isSelected ? "bg-primary" : "bg-[#3F3F3F]"}`;
      case "next":
      case "create":
        return `bg-[#3F3F3F] rounded-full border border-[#565656] hover:bg-[#222222]`;
      case "cancel":
        return `bg-[#3F3F3F] rounded-[10px] border border-[#565656] hover:bg-[#222222]`;
      case "save":
        return `bg-mainGreen rounded-[10px] border border-[#4CE5A9] hover:bg-[#00A264]`;
      default:
        return "";
    }
  };

  return (
    <button
      type={type}
      className={`flex items-center justify-center gap-2 py-1.5 px-4 text-white ${getButtonStyles()}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
    >
      {imgSrc && iconPosition === "left" && (
        <Image src={`/${imgSrc}.svg`} alt={imgAlt} width={16} height={16} />
      )}
      <p className="font-Pretendard font-normal text-center text-base">{label}</p>
      {imgSrc && iconPosition === "right" && (
        <Image src={`/${imgSrc}.svg`} alt={imgAlt} width={16} height={16} />
      )}
    </button>
  );
};

export default Button;
