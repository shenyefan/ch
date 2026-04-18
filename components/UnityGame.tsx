'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import type { Language } from '@/lib/i18n';
import { copy, t } from '@/lib/i18n';

export interface UnityGameHandle {
  setFullscreen: () => void;
}

const LOADER_SRC = '/game/build.loader.js';

const UnityGame = forwardRef<UnityGameHandle, { language: Language }>(
  function UnityGame({ language }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<unknown>(null);
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      setFullscreen: () => {
        (instanceRef.current as { SetFullscreen?: (v: number) => void })?.SetFullscreen?.(1);
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let cancelled = false;

      const quit = () => {
        cancelled = true;
        const inst = instanceRef.current as { Quit?: () => Promise<void> } | null;
        inst?.Quit?.().catch(() => {});
        instanceRef.current = null;
      };

      const init = (win: Window & typeof globalThis) => {
        const createUnityInstance = (
          win as unknown as { createUnityInstance?: (...args: unknown[]) => Promise<unknown> }
        ).createUnityInstance;
        if (!createUnityInstance || cancelled) return;

        const buildUrl = '/game';
        const remoteBuildUrl = 'https://files.suki.icu/ch/game';

        createUnityInstance(
          canvas,
          {
            dataUrl: remoteBuildUrl + '/build.data',
            frameworkUrl: buildUrl + '/build.framework.js',
            codeUrl: remoteBuildUrl + '/build.wasm',
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'DefaultCompany',
            productName: 'chinese proj',
            productVersion: '0.1',
          },
          (p: number) => {
            if (!cancelled) setProgress(p);
          }
        )
          .then((instance: unknown) => {
            if (cancelled) {
              (instance as { Quit?: () => Promise<void> })?.Quit?.().catch(() => {});
              return;
            }
            instanceRef.current = instance;
            setLoaded(true);
          })
          .catch((msg: string) => console.error('[Unity]', msg));
      };

      // Re-use already-loaded script if present
      if ((window as unknown as { createUnityInstance?: unknown }).createUnityInstance) {
        init(window);
        return quit;
      }

      const existing = document.querySelector<HTMLScriptElement>(`script[src="${LOADER_SRC}"]`);
      if (existing) {
        existing.addEventListener('load', () => init(window));
        return quit;
      }

      const script = document.createElement('script');
      script.src = LOADER_SRC;
      script.onload = () => init(window);
      document.body.appendChild(script);

      return quit;
    }, []);

    return (
      <div className="relative w-full h-full bg-[#231F20]">
        <canvas ref={canvasRef} id="unity-canvas" className="w-full h-full block" tabIndex={-1} />

        {/* Loading overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none">
            <div className="text-white/60 text-sm tracking-widest font-[Cinzel,serif]">
              {t(copy.game.loading, language)}
            </div>
            <div className="w-[220px] h-[5px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] rounded-full"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="text-[#D4AF37]/50 text-xs">
              {Math.round(progress * 100)}%
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default UnityGame;
