"use client";
import React, { useState, useRef, useEffect } from "react";
import Controller from "../molecules/Controller";

export default function VideoUploader() {
  const [videoSrc, setVideoSrc] = useState("");
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [endPlaybackTime, setEndPlaybackTime] = useState(0); // User-set end time for playback

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoSrc(fileUrl);
      setCurrentTime(0);
      setSeekTime(0);
      setEndPlaybackTime(0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setEndPlaybackTime(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime >= endPlaybackTime) {
        videoRef.current.pause(); // Pause when end time is reached
        videoRef.current.currentTime = seekTime; // Optional: rewind to start time
      }
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current && time >= 0 && time <= duration) {
      videoRef.current.currentTime = time;
      setSeekTime(time);
    }
  };

  const handleSetEndTime = (time) => {
    if (time >= 0 && time <= duration) {
      setEndPlaybackTime(time);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1 className="text-xl p-6 text-white">비디오 업로드 데모입니다</h1>
      <input
        className="text-secondary p-2"
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />
      {videoSrc && (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            width="500"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            controls
          />
          <Controller
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            setEndTime={handleSetEndTime}
          />
        </>
      )}
    </div>
  );
}
