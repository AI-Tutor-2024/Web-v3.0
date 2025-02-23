import { useState, useEffect } from "react";

const useFileDuration = (file: File | null): number | null => {
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!file) {
      setDuration(null);
      return;
    }

    const url = URL.createObjectURL(file);
    const audio = document.createElement("audio");

    audio.preload = "metadata";
    audio.src = url;

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      setDuration(Math.floor(audio.duration / 60)); // 초 → 분 변환
    };

    audio.onerror = () => {
      setDuration(null);
    };
  }, [file]);

  return duration;
};

export default useFileDuration;
