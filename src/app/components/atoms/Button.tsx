import React from "react";
import Image from "next/image";

// 통합된 Button Prop 타입 정의
interface ButtonProps {
  label?: string; // 버튼의 텍스트
  disabled?: boolean; // 버튼 비활성화 여부
  imgSrc?: string; // 이미지 소스 (옵션)
  isSelected?: boolean; // 선택된 상태 여부 (옵션)
  onClick?: () => void; // 클릭 핸들러 (옵션)
  onMouseEnter?: () => void; // 마우스 엔터 핸들러 (옵션)
  onMouseLeave?: () => void; // 마우스 리브 핸들러 (옵션)
  type?: "button" | "submit" | "reset"; // 버튼 타입
  variant?: "select" | "next" | "create" | "cancel" | "save"; // 버튼 스타일 종류
}

// 통합된 Button 컴포넌트
const Button: React.FC<ButtonProps> = ({
  label = "",
  disabled = false,
  imgSrc,
  isSelected = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  type = "button",
  variant = "create",
}) => {
  // variant에 따른 스타일 적용
  const getButtonStyles = () => {
    switch (variant) {
      case "select":
        return `rounded-full ${isSelected ? "bg-mainGreen" : "bg-[#3F3F3F]"}`;
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
      className={`flex items-center justify-center py-1.5 px-4 text-white ${getButtonStyles()}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
    >
      <p className="font-Pretendard rounded-full font-normal text-center text-base">
        {label}
      </p>
      {/* 이미지 소스가 존재하면 렌더링 */}
      {imgSrc && (
        <Image
          src={`/${imgSrc}.svg`}
          alt="icon"
          width={10}
          height={10}
          className="ml-2"
        />
      )}
    </button>
  );
};

export default Button;
