"use client";

import { useState, useEffect } from "react";
import Meyda from "meyda";

export default function Home() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioFeatures, setAudioFeatures] = useState({ rms: 0, zcr: 0, energy: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzer, setAnalyzer] = useState<any>();

  const handleToggleAnalyzing = () => {
    setIsAnalyzing(!isAnalyzing);
  };

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsAudioEnabled(true);

        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        const analyzer = Meyda.createMeydaAnalyzer({
          audioContext: audioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ["rms", "zcr", "energy"],
          callback: (features: any) => {
            setAudioFeatures({ rms: features.rms, zcr: features.zcr, energy: features.energy });
          },
        });
        setAnalyzer(analyzer);
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    if (!isAudioEnabled) {
      initializeAudio();
    }
  }, [isAudioEnabled]);

  useEffect(() => {
    if (analyzer) {
      if (isAnalyzing) {
        analyzer.start();
      } else {
        analyzer.stop();
      }
    }
  }, [isAnalyzing, analyzer]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-10">
      <button onClick={handleToggleAnalyzing} className=" bg-purple-900 p-3 rounded-lg">{isAnalyzing ? "Stop" : "Start"}</button>
      <div className="flex justify-center items-center flex-col gap-5">
        <h1>ZCR : {audioFeatures.zcr}</h1>
        <h1>RMS : {audioFeatures.rms}</h1>
        <h1>Energy : {audioFeatures.energy}</h1>
        <p className={`p-3 ${audioFeatures.rms > 0.06 ? "bg-red-800" : "bg-green-800"}`}>{audioFeatures.rms > 0.12 ? "High Volume" : "Low Volume"}</p>

      </div>
    </main >
  );
}
