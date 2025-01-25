import React from "react";

type ControllerProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  setEndTime: (time: number) => void;
};

export default function Controller({
  currentTime,
  duration,
  onSeek,
  setEndTime,
}: ControllerProps) {
  const formatTime = (time) => {
    const rounded = Math.floor(time);
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeekChange = (event) => {
    const newTime = parseFloat(event.target.value);
    onSeek(newTime);
  };

  const handleEndTimeChange = (event) => {
    const newTime = parseFloat(event.target.value);
    setEndTime(newTime);
  };

  return (
    <div className="controller">
      <div className="flex w-full text-black font-bold p-2 bg-white justify-between gap-12">
        <div>시작 시간 {formatTime(currentTime)}</div>
        <div>끝 시간 {formatTime(duration)}</div>
      </div>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeekChange}
        step="0.1"
      />
    </div>
  );
}
