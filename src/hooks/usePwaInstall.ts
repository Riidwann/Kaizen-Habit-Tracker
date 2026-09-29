import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface UsePwaInstallResult {
  isInstallable: boolean;
  isInstalled: boolean;
  isIos: boolean;
  promptInstall: () => Promise<boolean>;
}

export function usePwaInstall(): UsePwaInstallResult {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if running as standalone PWA
    const isStandalone =
      (typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches) ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(Boolean(isStandalone));

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for install prompt on Chromium browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    }

    // If iOS or browser doesn't support beforeinstallprompt, alert instructions
    if (isIos) {
      alert("Untuk memasang di iPhone/iPad: Ketuk ikon Bagikan (Share) di Safari, lalu pilih 'Tambah ke Layar Utama' (Add to Home Screen).");
      return false;
    }

    alert("Aplikasi dapat dipasang melalui menu browser Anda: Pilih 'Instal Aplikasi' atau 'Tambahkan ke Layar Utama'.");
    return false;
  }, [deferredPrompt, isIos]);

  return {
    isInstallable: (!isInstalled && (deferredPrompt !== null || isIos)),
    isInstalled,
    isIos,
    promptInstall,
  };
}
