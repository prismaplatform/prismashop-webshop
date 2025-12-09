"use client";

import { useEffect, useState } from "react";
import {
  Contrast,
  Eye,
  LucideAccessibility,
  MousePointer,
  Palette,
  Type,
  X,
} from "lucide-react";

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: "default" | "dyslexia" | "arial" | "verdana";
  highlightLinks: boolean;
  highlightHeadings: boolean;
  cursorSize: "default" | "large" | "extra-large";
  cursorColor: "default" | "black" | "white";
  contrast: "default" | "high" | "higher";
  saturation: number;
  invertColors: boolean;
  grayscale: boolean;
  disableAnimations: boolean;
  screenReader: boolean;
  textSpacing: boolean;
  hideImages: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  lineHeight: 100,
  letterSpacing: 0,
  fontFamily: "default",
  highlightLinks: false,
  highlightHeadings: false,
  cursorSize: "default",
  cursorColor: "default",
  contrast: "default",
  saturation: 100,
  invertColors: false,
  grayscale: false,
  disableAnimations: false,
  screenReader: false,
  textSpacing: false,
  hideImages: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] =
    useState<AccessibilitySettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<"vision" | "motor" | "cognitive">(
    "vision",
  );

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load accessibility settings");
      }
    }
  }, []);

  // Save settings and apply them
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    applySettings();
  }, [settings]);

  const applySettings = () => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.style.setProperty("--a11y-font-scale", `${settings.fontSize / 100}`);
    if (settings.fontSize !== 100) {
      body.classList.add("a11y-font-active");
    } else {
      body.classList.remove("a11y-font-active");
    }

    // Line height
    root.style.setProperty(
      "--a11y-line-height",
      `${settings.lineHeight / 100}`,
    );
    if (settings.lineHeight !== 100) {
      body.classList.add("a11y-line-active");
    } else {
      body.classList.remove("a11y-line-active");
    }

    // Letter spacing
    root.style.setProperty(
      "--a11y-letter-spacing",
      `${settings.letterSpacing}px`,
    );
    if (settings.letterSpacing !== 0) {
      body.classList.add("a11y-letter-active");
    } else {
      body.classList.remove("a11y-letter-active");
    }

    // Font family
    const fontFamilies = {
      default: "",
      dyslexia: "OpenDyslexic, Comic Sans MS, sans-serif",
      arial: "Arial, sans-serif",
      verdana: "Verdana, sans-serif",
    };
    root.style.setProperty(
      "--a11y-font-family",
      fontFamilies[settings.fontFamily],
    );
    if (settings.fontFamily !== "default") {
      body.classList.add("a11y-font-family-active");
    } else {
      body.classList.remove("a11y-font-family-active");
    }

    // Cursor
    const cursorSizes = {
      default: "",
      large:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M2 2 L2 28 L12 22 L16 30 L20 28 L16 20 L24 20 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E\") 2 2, auto",
      "extra-large":
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M2 2 L2 42 L18 33 L24 45 L30 42 L24 30 L36 30 Z' fill='black' stroke='white' stroke-width='3'/%3E%3C/svg%3E\") 2 2, auto",
    };
    root.style.cursor = cursorSizes[settings.cursorSize];

    // Contrast
    if (settings.contrast === "high") {
      root.classList.add("a11y-high-contrast");
      root.classList.remove("a11y-higher-contrast");
    } else if (settings.contrast === "higher") {
      root.classList.add("a11y-higher-contrast");
      root.classList.remove("a11y-high-contrast");
    } else {
      root.classList.remove("a11y-high-contrast", "a11y-higher-contrast");
    }

    // Saturation
    root.style.setProperty("--a11y-saturation", `${settings.saturation}%`);

    // Invert colors
    root.classList.toggle("a11y-invert", settings.invertColors);

    // Grayscale
    root.classList.toggle("a11y-grayscale", settings.grayscale);

    // Disable animations - including GSAP
    if (settings.disableAnimations) {
      root.classList.add("a11y-no-animations");

      // Kill all GSAP animations if GSAP is available
      if (typeof window !== "undefined" && (window as any).gsap) {
        const gsap = (window as any).gsap;
        try {
          gsap.globalTimeline.pause();
          gsap.killTweensOf("*");
        } catch (e) {
          console.warn("Could not pause GSAP:", e);
        }
      }

      // Disable ScrollTrigger if available
      if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
        try {
          (window as any).ScrollTrigger.getAll().forEach((trigger: any) => {
            trigger.disable();
          });
        } catch (e) {
          console.warn("Could not disable ScrollTrigger:", e);
        }
      }
    } else {
      root.classList.remove("a11y-no-animations");

      // Resume GSAP animations if GSAP is available
      if (typeof window !== "undefined" && (window as any).gsap) {
        const gsap = (window as any).gsap;
        try {
          if (gsap.globalTimeline.paused()) {
            gsap.globalTimeline.play();
          }
        } catch (e) {
          console.warn("Could not resume GSAP:", e);
        }
      }

      // Enable ScrollTrigger if available
      if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
        try {
          (window as any).ScrollTrigger.getAll().forEach((trigger: any) => {
            trigger.enable();
          });
        } catch (e) {
          console.warn("Could not enable ScrollTrigger:", e);
        }
      }
    }

    // Highlight links
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);

    // Highlight headings
    root.classList.toggle(
      "a11y-highlight-headings",
      settings.highlightHeadings,
    );

    // Text spacing
    root.classList.toggle("a11y-text-spacing", settings.textSpacing);

    // Hide images
    root.classList.toggle("a11y-hide-images", settings.hideImages);

    // Mark body as having active accessibility features
    const hasActiveFeatures = Object.entries(settings).some(([key, value]) => {
      const defaultValue = defaultSettings[key as keyof AccessibilitySettings];
      return value !== defaultValue;
    });
    body.classList.toggle("a11y-active", hasActiveFeatures);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9998] bg-primary-500 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-50"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <LucideAccessibility className="w-6 h-6" />
      </button>

      {/* Widget panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Accessibility Settings</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Customize your viewing experience
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab("vision")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "vision"
                    ? "border-b-2 border-primary-500 text-primary-500 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Vision
              </button>
              <button
                onClick={() => setActiveTab("motor")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "motor"
                    ? "border-b-2 border-primary-500 text-primary-500 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MousePointer className="w-4 h-4 inline mr-2" />
                Motor
              </button>
              <button
                onClick={() => setActiveTab("cognitive")}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "cognitive"
                    ? "border-b-2 border-primary-500 text-primary-500 bg-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Type className="w-4 h-4 inline mr-2" />
                Cognitive
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Vision Tab */}
              {activeTab === "vision" && (
                <div className="space-y-6">
                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Contrast className="w-4 h-4 inline mr-2" />
                      Contrast
                    </label>
                    <div className="flex gap-2">
                      {["default", "high", "higher"].map((level) => (
                        <button
                          key={level}
                          onClick={() =>
                            setSettings({ ...settings, contrast: level as any })
                          }
                          className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                            settings.contrast === level
                              ? "border-primary-500 bg-blue-50 text-primary-700 font-medium"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Palette className="w-4 h-4 inline mr-2" />
                      Saturation: {settings.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={settings.saturation}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          saturation: Number(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        Invert Colors
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.invertColors}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            invertColors: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        Grayscale (Black & White)
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.grayscale}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            grayscale: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        Hide Images
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.hideImages}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            hideImages: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Motor Tab */}
              {activeTab === "motor" && (
                <div className="space-y-6">
                  {/* Cursor Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <MousePointer className="w-4 h-4 inline mr-2" />
                      Cursor Size
                    </label>
                    <div className="flex gap-2">
                      {(["default", "large", "extra-large"] as const).map(
                        (size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSettings({ ...settings, cursorSize: size })
                            }
                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                              settings.cursorSize === size
                                ? "border-primary-500 bg-blue-50 text-primary-700 font-medium"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {size
                              .split("-")
                              .map(
                                (w) => w.charAt(0).toUpperCase() + w.slice(1),
                              )
                              .join(" ")}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Highlight Links */}
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Highlight Links
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.highlightLinks}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          highlightLinks: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      Disable Animations
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.disableAnimations}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          disableAnimations: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                    />
                  </label>
                </div>
              )}

              {/* Cognitive Tab */}
              {activeTab === "cognitive" && (
                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Type className="w-4 h-4 inline mr-2" />
                      Font Size: {settings.fontSize}%
                    </label>
                    <input
                      type="range"
                      min="90"
                      max="150"
                      step="5"
                      value={settings.fontSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          fontSize: Number(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>90%</span>
                      <span>100%</span>
                      <span>150%</span>
                    </div>
                  </div>

                  {/* Line Height */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Line Height: {settings.lineHeight}%
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="180"
                      step="10"
                      value={settings.lineHeight}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          lineHeight: Number(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Normal</span>
                      <span>Comfortable</span>
                      <span>Spacious</span>
                    </div>
                  </div>

                  {/* Letter Spacing */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Letter Spacing: {settings.letterSpacing}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={settings.letterSpacing}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          letterSpacing: Number(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Normal</span>
                      <span>Wide</span>
                      <span>Extra Wide</span>
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Font Family
                    </label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          fontFamily: e.target.value as any,
                        })
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    >
                      <option value="default">Default</option>
                      <option value="dyslexia">Dyslexia Friendly</option>
                      <option value="arial">Arial</option>
                      <option value="verdana">Verdana</option>
                    </select>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        Highlight Headings
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.highlightHeadings}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            highlightHeadings: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        Increased Text Spacing
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.textSpacing}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            textSpacing: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
              <button
                onClick={resetSettings}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}