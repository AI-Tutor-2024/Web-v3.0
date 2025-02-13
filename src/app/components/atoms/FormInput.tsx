import React from "react";

interface FormInputProps {
  name: string;
  defaultValue?: string; // 초기값 설정
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  variant?: "round" | "square"; // round 또는 square로 className 지정
  labelClassName?: string; // 라벨 커스텀 스타일
  disabled?: boolean; // input 비활성화 여부 추가
  className?: string; // input 커스텀 스타일
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  defaultValue = "",
  placeholder = "",
  onChange,
  label,
  variant = "square", // 기본적으로 "square" 설정
  labelClassName = "",
  disabled = false, // 기본적으로 비활성화되지 않음
  className = "", // 추가된 속성
}) => {
  // `variant`에 따른 클래스명 분리
  const inputClassName =
    variant === "round"
      ? "bg-black-90 text-white rounded-full outline-none px-4 py-2"
      : "bg-black-80 text-white rounded-md outline-none px-4 py-2";

  return (
    <div className="flex flex-row w-full ">
      {label && (
        <label className={`text-white text-base text-start ${labelClassName}`}>
          {label}
        </label>
      )}
      <input
        type="text"
        name={name}
        defaultValue={defaultValue} // 초기값은 defaultValue로 지정
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled} // disabled 속성 추가
        className={`${inputClassName} ${className} ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`} // 비활성화 스타일 추가
      />
    </div>
  );
};
