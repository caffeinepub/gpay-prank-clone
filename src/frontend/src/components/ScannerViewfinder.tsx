import { X, Zap } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback } from "react";

// Dynamically load jsQR from CDN to avoid missing package dependency
type JsQRFn = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options?: { inversionAttempts?: string },
) => { data: string } | null;

let jsQRCache: JsQRFn | null = null;
async function loadJsQR(): Promise<JsQRFn> {
  if (jsQRCache) return jsQRCache;
  await new Promise<void>((resolve, reject) => {
    if ((window as unknown as Record<string, unknown>).jsQR) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load jsQR"));
    document.head.appendChild(script);
  });
  jsQRCache = (window as unknown as Record<string, JsQRFn>).jsQR;
  return jsQRCache;
}

interface ScannerViewfinderProps {
  onDetected: (upiId: string, name: string) => void;
  onClose: () => void;
}

function deriveNameFromUpiId(upiId: string): string {
  const localPart = upiId.split("@")[0] || upiId;
  // Remove trailing digits
  const withoutTrailingDigits = localPart.replace(/\d+$/, "");
  // Split on dots, underscores, hyphens
  const words = withoutTrailingDigits
    .split(/[._\-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ") || localPart;
}

export default function ScannerViewfinder({
  onDetected,
  onClose,
}: ScannerViewfinderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const detectedRef = useRef(false);

  const [scanning, setScanning] = useState(true);
  const [detected, setDetected] = useState(false);
  const [detectedUpiId, setDetectedUpiId] = useState("");
  const [detectedName, setDetectedName] = useState("");
  const [progress, setProgress] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
  }, []);

  const scanFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(() => {
        scanFrame();
      });
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      animFrameRef.current = requestAnimationFrame(() => {
        scanFrame();
      });
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const jsQR = await loadJsQR();
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && !detectedRef.current) {
        detectedRef.current = true;
        const rawText = code.data;
        const upiId = rawText;
        const name = deriveNameFromUpiId(upiId);

        setDetectedUpiId(upiId);
        setDetectedName(name);
        setDetected(true);
        setScanning(false);
        setProgress(100);

        stopCamera();
        setTimeout(() => onDetected(upiId, name), 1200);
        return;
      }
    } catch {
      // jsQR failed to load or scan; continue trying
    }

    // Continue scanning
    animFrameRef.current = requestAnimationFrame(() => {
      scanFrame();
    });
  }, [onDetected, stopCamera]);

  useEffect(() => {
    // Progress animation while scanning
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return p; // hold at 95 until actual detection
        return p + 1.5;
      });
    }, 80);

    // Start camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser does not support camera access.");
      clearInterval(progressInterval);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((stream) => {
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play().catch(() => {});
          setCameraStarted(true);
          // Start scan loop after video is playing
          video.onloadedmetadata = () => {
            animFrameRef.current = requestAnimationFrame(() => {
              scanFrame();
            });
          };
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("Permission") ||
          msg.includes("NotAllowed") ||
          msg.includes("denied")
        ) {
          setCameraError(
            "Camera permission denied. Please allow camera access and try again.",
          );
        } else {
          setCameraError(
            "Unable to access camera. Please check your device settings.",
          );
        }
      });

    return () => {
      clearInterval(progressInterval);
      stopCamera();
    };
  }, [scanFrame, stopCamera]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "oklch(0.05 0.01 250)" }}
    >
      {/* Live camera video — full screen behind everything */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        style={{
          opacity: cameraStarted ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
        tabIndex={-1}
        aria-label="Camera viewfinder"
      />

      {/* Semi-transparent dark overlay to darken camera feed outside frame */}
      {cameraStarted && (
        <div
          className="absolute inset-0"
          style={{ background: "oklch(0.05 0.01 250 / 0.55)" }}
          aria-hidden="true"
        />
      )}

      {/* Hidden canvas for frame capture — purely computational, no visual output */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 rounded-full"
          style={{ background: "oklch(0.2 0.02 250 / 0.85)" }}
          aria-label="Close scanner"
        >
          <X size={20} style={{ color: "oklch(0.97 0.005 250)" }} />
        </button>
        <h2
          className="text-lg font-semibold"
          style={{ color: "oklch(0.97 0.005 250)" }}
        >
          Scan QR Code
        </h2>
        <div
          className="p-2 rounded-full"
          style={{ background: "oklch(0.2 0.02 250 / 0.85)" }}
        >
          <Zap size={20} style={{ color: "oklch(0.72 0.17 175)" }} />
        </div>
      </div>

      {/* Camera error state */}
      {cameraError && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
            style={{ background: "oklch(0.22 0.025 250)" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm1 18h-2v-2h2v2zm0-4h-2V9h2v9z"
                fill="oklch(0.65 0.17 28)"
              />
            </svg>
          </div>
          <p
            className="text-base font-semibold"
            style={{ color: "oklch(0.97 0.005 250)" }}
          >
            Camera Unavailable
          </p>
          <p className="text-sm" style={{ color: "oklch(0.60 0.02 250)" }}>
            {cameraError}
          </p>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="mt-4 px-6 py-3 rounded-full font-semibold text-sm"
            style={{ background: "oklch(0.55 0.22 240)", color: "white" }}
          >
            Close
          </button>
        </div>
      )}

      {/* Scanner frame area */}
      {!cameraError && (
        <div className="relative z-10 flex-1 flex items-center justify-center px-8">
          <div className="relative w-full max-w-[280px] aspect-square">
            {/* Scanner frame corners */}
            <div className="absolute inset-0">
              <div className="scanner-corner scanner-corner-tl" />
              <div className="scanner-corner scanner-corner-tr" />
              <div className="scanner-corner scanner-corner-bl" />
              <div className="scanner-corner scanner-corner-br" />
            </div>

            {/* Scanning line animation */}
            {scanning && (
              <div
                className="absolute left-2 right-2 h-0.5 scanner-line"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.72 0.17 175), transparent)",
                  boxShadow: "0 0 8px oklch(0.72 0.17 175)",
                }}
                aria-hidden="true"
              />
            )}

            {/* Detected overlay */}
            {detected && (
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.72 0.17 175 / 0.2)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center animate-success-scale"
                  style={{ background: "oklch(0.72 0.17 175)" }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 16L13 23L26 9"
                      stroke="oklch(0.1 0.01 250)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="tick-path"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {!cameraError && (
        <div className="relative z-10 px-8 mb-4">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "oklch(0.22 0.025 250)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "oklch(0.72 0.17 175)",
              }}
              role="progressbar"
              tabIndex={0}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Bottom text */}
      {!cameraError && (
        <div className="relative z-10 px-8 pb-12 text-center">
          <p className="text-sm" style={{ color: "oklch(0.65 0.02 250)" }}>
            {detected
              ? "✓ QR Code detected!"
              : "Align QR code within the frame"}
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.02 250)" }}>
            {detected
              ? "Redirecting to payment..."
              : cameraStarted
                ? "Hold steady — scanning automatically..."
                : "Starting camera..."}
          </p>

          {/* UPI info card — shown after detection */}
          {detected && detectedUpiId && (
            <div
              className="mt-3 mx-auto rounded-xl px-4 py-3 text-left"
              style={{
                background: "oklch(0.14 0.018 250 / 0.9)",
                border: "1px solid oklch(0.55 0.22 240 / 0.5)",
                maxWidth: "300px",
              }}
            >
              <p
                className="text-xs font-semibold mb-0.5"
                style={{ color: "#1a73e8" }}
              >
                Paying: {detectedName}
              </p>
              <p className="text-xs" style={{ color: "oklch(0.60 0.02 250)" }}>
                {detectedUpiId}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
