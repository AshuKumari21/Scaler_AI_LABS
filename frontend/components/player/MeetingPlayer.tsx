'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  FastForward,
  Sparkles
} from 'lucide-react';
import { formatSeconds } from '@/lib/utils';

interface MeetingPlayerProps {
  currentTime: number;
  totalDurationSeconds: number;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const MeetingPlayer: React.FC<MeetingPlayerProps> = ({
  currentTime,
  totalDurationSeconds,
  onSeek,
  isPlaying,
  setIsPlaying,
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Smooth playback ticker loop
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = Date.now();
      const tick = () => {
        const now = Date.now();
        const deltaSeconds = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
        lastTimeRef.current = now;

        const nextTime = currentTime + deltaSeconds;
        if (nextTime >= totalDurationSeconds) {
          onSeek(totalDurationSeconds);
          setIsPlaying(false);
        } else {
          onSeek(nextTime);
          animationFrameRef.current = requestAnimationFrame(tick);
        }
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentTime, totalDurationSeconds, playbackSpeed, onSeek, setIsPlaying]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  const handleSkipBack = () => {
    onSeek(Math.max(0, currentTime - 5));
  };

  const handleSkipForward = () => {
    onSeek(Math.min(totalDurationSeconds, currentTime + 5));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800">
      {/* Top row: Status info */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200">Synchronized Audio Sync</span>
        </div>
        <div className="font-mono text-slate-300 font-medium">
          {formatSeconds(currentTime)} / {formatSeconds(totalDurationSeconds)}
        </div>
      </div>

      {/* Seek Progress Bar Slider */}
      <div className="relative mb-4 group">
        <input
          type="range"
          min={0}
          max={totalDurationSeconds || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 hover:bg-slate-600 transition-all"
        />
        <div 
          className="absolute left-0 top-0 h-2 bg-gradient-to-r from-brand-500 to-purple-500 rounded-lg pointer-events-none"
          style={{ width: `${(currentTime / (totalDurationSeconds || 1)) * 100}%` }}
        />
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls (Play/Pause, Skip) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSkipBack}
            title="Rewind 5 seconds"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-600/30 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={handleSkipForward}
            title="Skip 5 seconds"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector & Volume Control */}
        <div className="flex items-center gap-4">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-xl text-xs">
            <FastForward className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {speedOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white p-1">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseInt(e.target.value, 10));
                setIsMuted(false);
              }}
              className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
