import React, { useEffect, useRef, useState } from "react";
import Button from "@/app/components/atoms/Button";
import CountInput from "@/app/components/atoms/CountInput";
import Popover from "@/app/components/molecules/PopOver";
import { usePracticeContext } from "@/app/context/PracticeContext";

const NewPracticeForm: React.FC = () => {
  const { practiceSize, setPracticeSize, type, setType } = usePracticeContext();
  const [countOption, setCountOption] = useState<"AI" | "manual">("AI");

  // Popover 상태와 위치 저장
  const [showPopover, setShowPopover] = useState<"OX" | "SHORT" | null>(null);
  const oxRef = useRef<HTMLDivElement>(null); // OX 버튼에 대한 ref
  const shortRef = useRef<HTMLDivElement>(null); // 단답형 버튼에 대한 ref

  const [oxPopoverPosition, setOXPopoverPosition] = useState<{
    top: string;
    left: string;
  }>({
    top: "0px",
    left: "0px",
  });
  const [shortPopoverPosition, setShortPopoverPosition] = useState<{
    top: string;
    left: string;
  }>({
    top: "0px",
    left: "0px",
  });

  // Popover 위치 설정
  useEffect(() => {
    if (oxRef.current) {
      const rect = oxRef.current.getBoundingClientRect();
      setOXPopoverPosition({
        top: `${rect.bottom + window.scrollY + 15}px`,
        left: `${rect.left + window.scrollX}`,
      });
    }
    if (shortRef.current) {
      const rect = shortRef.current.getBoundingClientRect();
      setShortPopoverPosition({
        top: `${rect.bottom + window.scrollY + 15}px`,
        left: `${rect.left + window.scrollX}`,
      });
    }
  }, [oxRef, shortRef]);

  // 문제 개수 변경 핸들러
  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(event.target.value);
    setPracticeSize(isNaN(newSize) ? 0 : newSize); // NaN인 경우 0으로 설정
  };

  // 문제 유형 선택 토글 핸들러
  const toggleType = (selectedType: "OX" | "SHORT") => {
    if (type === "") {
      // 빈 상태에서 선택하면 그 타입을 단일 선택으로 설정
      setType(selectedType);
    } else if (type === "OX" && selectedType === "OX") {
      // OX만 선택된 상태에서 다시 OX를 누르면 빈 상태로 변경
      setType("");
    } else if (type === "SHORT" && selectedType === "SHORT") {
      // SHORT만 선택된 상태에서 다시 SHORT를 누르면 빈 상태로 변경
      setType("");
    } else if (type === "OX" && selectedType === "SHORT") {
      // OX만 선택된 상태에서 SHORT를 선택하면 BOTH로 설정
      setType("BOTH");
    } else if (type === "SHORT" && selectedType === "OX") {
      // SHORT만 선택된 상태에서 OX를 선택하면 BOTH로 설정
      setType("BOTH");
    } else if (type === "BOTH" && selectedType === "OX") {
      // BOTH 상태에서 OX를 누르면 SHORT만 남김
      setType("SHORT");
    } else if (type === "BOTH" && selectedType === "SHORT") {
      // BOTH 상태에서 SHORT를 누르면 OX만 남김
      setType("OX");
    }
  };

  return (
    <div className="flex flex-col justify-start h-full">
      {/* 문제 개수 선택 */}
      <div className="flex flex-row gap-4 mb-8">
        <span className="text-white flex flex-col justify-start items-start mt-2">
          문제 개수
        </span>
        <div className="flex flex-col items-start gap-4">
          {/* AI 추천 버튼 */}
          <div className="flex flex-row items-center gap-4">
            <Button
              label="AI 추천"
              variant="select"
              isSelected={countOption === "AI"}
              onClick={() => {
                setCountOption("AI");
                setPracticeSize(0); // AI 추천 선택 시 practiceSize를 0으로 설정
              }}
            />
            <p className="text-white">복습에 필요한 진짜 문제를 제공해드려요</p>
          </div>

          {/* 직접 입력 버튼 */}
          <div className="flex items-center gap-4">
            <Button
              label="직접 입력"
              variant="select"
              isSelected={countOption === "manual"}
              onClick={() => setCountOption("manual")}
            />
            {/* 문제 개수 입력 필드 - 직접 입력 선택 시에만 활성화 */}
            {countOption === "manual" && (
              <CountInput
                name="count"
                defaultValue={
                  practiceSize !== null ? practiceSize.toString() : ""
                }
                onChange={handleCountChange}
                placeholder="0"
              />
            )}
          </div>
        </div>
      </div>

      {/* 문제 유형 선택 */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-white">문제 유형</span>
        <div
          ref={oxRef}
          onMouseEnter={() => setShowPopover("OX")}
          onMouseLeave={() => setShowPopover(null)}
        >
          <Button
            label="O X 퀴즈"
            variant="select"
            isSelected={type === "OX" || type === "BOTH"}
            onClick={() => toggleType("OX")}
          />
          {showPopover === "OX" && (
            <Popover type="OX" position={oxPopoverPosition} />
          )}
        </div>
        <div
          ref={shortRef}
          onMouseEnter={() => setShowPopover("SHORT")}
          onMouseLeave={() => setShowPopover(null)}
        >
          <Button
            label="단답형"
            variant="select"
            isSelected={type === "SHORT" || type === "BOTH"}
            onClick={() => toggleType("SHORT")}
          />
          {showPopover === "SHORT" && (
            <Popover type="단답형" position={shortPopoverPosition} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPracticeForm;
