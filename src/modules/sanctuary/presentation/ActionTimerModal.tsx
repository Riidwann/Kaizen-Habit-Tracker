import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X, Sparkles, CheckCircle2 } from "lucide-react";
import { MicroAction } from "../domain/MicroAction";
import { Modal } from "@/shared/presentation/Modal";
import { Button } from "@/shared/presentation/Button";
import {
  WebAudioService,
  webAudioService as defaultWebAudioService,
} from "@/shared/infrastructure/WebAudioService";

export interface ActionTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: MicroAction | null;
  onComplete: (actionId: string) => void;
  webAudioService?: WebAudioService;
}

export const ActionTimerModal: React.FC<ActionTimerModalProps> = ({
  isOpen,
  onClose,
  action,
  onComplete,
  webAudioService = defaultWebAudioService,
}) => {
  const totalSeconds = (action?.estimatedMinutes ?? 2) * 60; // 120s default
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state whenever modal opens or action changes
  useEffect(() => {
    if (isOpen) {
      const initial = (action?.estimatedMinutes ?? 2) * 60;
      setTimeLeft(initial);
      setIsRunning(false);
      setIsFinished(false);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsRunning(false);
    }
  }, [isOpen, action]);

  // Timer interval handling
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            try {
              webAudioService.playCompletionChime();
            } catch (e) {
              console.warn("[ActionTimerModal] Audio play error:", e);
            }
            if (action) {
              onComplete(action.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, action, onComplete, webAudioService]);

  const handleTogglePlay = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalSeconds);
      setIsFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(totalSeconds);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG Circular progress
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    totalSeconds > 0 ? circumference - (timeLeft / totalSeconds) * circumference : 0;

  if (!isOpen || !action) {
    return null;
  }

  const title = action.isScaledDown ? action.scaleDownTitle : action.title;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fokus 2-Menit Kaizen"
      description="Mulailah dengan napas tenang. Hanya 2 menit untuk membangun momentum."
      className="max-w-md text-center"
    >
      <div className="flex flex-col items-center justify-center pt-2 pb-4">
        {/* Action Title Card */}
        <div className="w-full mb-6 p-3.5 rounded-xl bg-sand-50 dark:bg-charcoal-800/60 border border-sand-200/80 dark:border-charcoal-700">
          <span className="text-xs uppercase tracking-wider font-semibold text-sage-700 dark:text-sage-400 block mb-1">
            Fokus Tindakan Saat Ini
          </span>
          <p className="text-base font-medium text-charcoal-900 dark:text-sand-50 leading-relaxed">
            {title}
          </p>
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative flex items-center justify-center my-3">
          <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-sand-200/70 dark:text-charcoal-800"
            />
            {/* Active Progress Circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="text-sage-500 transition-all duration-500 ease-linear dark:text-sage-400"
            />
          </svg>

          {/* Time Display Centered */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-light font-mono tracking-tight text-charcoal-900 dark:text-sand-50">
              {formatTime(timeLeft)}
            </span>
            {isFinished ? (
              <div className="flex items-center gap-1 mt-1 animate-fadeIn text-sage-700 dark:text-sage-300">
                <CheckCircle2 className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                <span className="text-xs font-semibold">
                  Selesai!
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-charcoal-500 dark:text-sand-400 uppercase tracking-widest mt-1">
                {isRunning ? "Fokus Mengalir" : "Siap Memulai"}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            aria-label="Reset timer"
            className="rounded-full w-11 h-11 p-0 flex items-center justify-center border-sand-300 dark:border-charcoal-700"
            title="Ulangi dari awal"
          >
            <RotateCcw className="w-4 h-4 text-charcoal-600 dark:text-sand-300" />
          </Button>

          <Button
            type="button"
            variant={isRunning ? "outline" : "sage"}
            size="lg"
            onClick={handleTogglePlay}
            aria-label={isRunning ? "Jeda timer" : "Mulai timer"}
            className="px-6 rounded-full font-medium shadow-sm gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{timeLeft === 0 ? "Mulai Lagi" : "Mulai"}</span>
              </>
            )}
          </Button>
        </div>

        {/* Zen guidance footer */}
        <p className="text-xs text-charcoal-500 dark:text-sand-400 mt-6 max-w-xs leading-relaxed italic">
          "Fokus pada proses selama 2 menit ini. Hasil besar berakar dari tindakan terkecil."
        </p>
      </div>
    </Modal>
  );
};
