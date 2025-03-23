import React, { useEffect, useState, useRef } from "react";

interface AntiCheatProtectionProps {
  children: React.ReactNode;
  showMessage?: boolean;
  onCheatDetected?: (method: string) => void;
  allowedMouseLeaveCount?: number;
  inactivityTimeoutSeconds?: number;
  strictMode?: boolean;
}

/**
 * Enhanced component that prevents various cheating methods:
 * - Disables right-click and developer tools shortcuts
 * - Detects when mouse leaves the page
 * - Detects browser tab changes
 * - Monitors for developer tools opening
 * - Prevents copying text
 * - Detects iframe embedding
 * - Monitors mouse movement and user focus
 */
const AntiCheatProtection: React.FC<AntiCheatProtectionProps> = ({
  children,
  showMessage = true,
  onCheatDetected = null,
  allowedMouseLeaveCount = 3,
  inactivityTimeoutSeconds = 20,
  strictMode = false,
}) => {
  const [mouseLeaveCount, setMouseLeaveCount] = useState<number>(0);
  const [devToolsOpened, setDevToolsOpened] = useState<boolean>(false);
  const [tabHidden, setTabHidden] = useState<boolean>(false);
  const lastMouseMoveTime = useRef<number>(Date.now());
  const lastFocusTime = useRef<number>(Date.now());
  const focusCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const mouseCheckInterval = useRef<NodeJS.Timeout | null>(null);

  const [copyContent, setCopyContent] = useState<string>("");

  useEffect(() => {
    // Reference for original window dimensions
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let isIframe = false;

    try {
      // Check if the page is in an iframe
      isIframe = window !== window.top;
    } catch (e) {
      // If we can't access window.top, we're likely in a cross-origin iframe
      isIframe = true;
    }

    // Function to show message when cheating is detected
    const showCheatDetectedMessage = (method: string): void => {
      if (onCheatDetected) {
        onCheatDetected(method);
      }

      if (!showMessage) return;

      const message = document.createElement("div");
      message.textContent = `Voilation detected: ${method}`;
      message.style.position = "fixed";
      message.style.top = "10px";
      message.style.left = "50%";
      message.style.transform = "translateX(-50%)";
      message.style.backgroundColor = "rgba(255,0,0,0.8)";
      message.style.color = "white";
      message.style.padding = "10px 20px";
      message.style.borderRadius = "5px";
      message.style.zIndex = "9999";
      message.style.fontWeight = "bold";

      document.body.appendChild(message);

      setTimeout(() => {
        document.body.removeChild(message);
      }, 3000);
    };

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault();
      //showCheatDetectedMessage('Right-click attempted');
    };

    // Disable keyboard shortcuts for developer tools
    const handleKeyDown = (e: KeyboardEvent): void => {
      const blockedKeys = [
        e.key === "F11",
        e.key === "F12",
        e.ctrlKey && e.shiftKey && e.key === "C",
        e.ctrlKey && e.shiftKey && e.key === "I",
        e.ctrlKey && e.shiftKey && e.key === "J",
        e.ctrlKey && e.shiftKey && e.key === "K",
        // e.altKey,
        e.ctrlKey && e.key === "u",
        // e.altKey && e.key === "u",
        // Print screen / screen capture
        e.key === "PrintScreen",
        // Prevent saving the page
        e.ctrlKey && e.key === "s",
        ,
        // Prevent inspector
        e.key === "F6",
        e.key === "F7",
        e.key === "Meta" || e.key === "Windows",
      ];

      console.log(e.key);

      // paste key listener
      if (e.key === "v" && e.ctrlKey) {
      }

      if (blockedKeys.includes(true)) {
        e.preventDefault();
        showCheatDetectedMessage("Keyboard shortcut blocked");
      }
    };

    // Detect mouse leaving the page
    const handleMouseLeave = (e: MouseEvent): void => {
      if (
        e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight
      ) {
        setMouseLeaveCount((prev) => prev + 1);

        if (mouseLeaveCount >= allowedMouseLeaveCount) {
          showCheatDetectedMessage("Mouse left the page");
        }
      }
    };

    // Track mouse movement to detect inactivity
    const handleMouseMove = (): void => {
      lastMouseMoveTime.current = Date.now();
    };

    // Track focus to detect when user is actively engaging with the page
    const handleFocus = (): void => {
      lastFocusTime.current = Date.now();
    };

    // Check if mouse has moved recently
    const checkMouseActivity = (): void => {
      const currentTime = Date.now();
      const timeSinceLastMove = currentTime - lastMouseMoveTime.current;

      // If mouse hasn't moved for the specified timeout period
      if (timeSinceLastMove > inactivityTimeoutSeconds * 1000) {
        //showCheatDetectedMessage("Mouse inactivity detected");
        // Reset the timer to avoid repeated alerts
        lastMouseMoveTime.current = currentTime;
      }
    };

    // Check if user has interacted with the page recently
    const checkFocusActivity = (): void => {
      const currentTime = Date.now();
      const timeSinceLastFocus = currentTime - lastFocusTime.current;

      // If no focus activity for the specified timeout period
      if (timeSinceLastFocus > inactivityTimeoutSeconds * 1000) {
        //("Focus inactivity detected");
        // Reset the timer to avoid repeated alerts
        //showCheatDetectedMessage("Focus inactivity detected");
        lastFocusTime.current = currentTime;
      }
    };

    // Detect tab visibility changes
    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        setTabHidden(true);
        showCheatDetectedMessage("Tab changed");
      } else {
        setTabHidden(false);
      }
    };

    // Detect window resize (potential dev tools opening)
    const handleResize = (): void => {
      const widthDifference = Math.abs(window.innerWidth - windowWidth);
    const heightDifference = Math.abs(window.innerHeight - windowHeight);

      // If the window size changed significantly, it might be dev tools
      if (widthDifference > 100 || heightDifference > 100) {
        setDevToolsOpened(true);
        showCheatDetectedMessage("Window resized (possible dev tools)");
      }

      // Update the reference dimensions
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    };

    // Detect copy attempts
    const handleCopy = (e: ClipboardEvent): void => {
      e.preventDefault();
      // showCheatDetectedMessage("Copy attempted");
      const selection = window.getSelection();
      if (selection) {
        setCopyContent(selection.toString());
        console.log(selection.toString());
      }
      //showCheatDetectedMessage("Copy attempted");
    };

    // Detect paste attempts
    const handlePaste = (e: ClipboardEvent): void => {
      e.preventDefault();
      // showCheatDetectedMessage("Paste attempted");
      const pastedText = e.clipboardData ? e.clipboardData.getData("text") : "";
      if (pastedText && pastedText !== copyContent) {
        showCheatDetectedMessage("Copy-paste detected");
      }
      if (pastedText) {
        showCheatDetectedMessage(`${pastedText}`);
        console.log(pastedText);
      }
    };

    // Detect if the page is being printed
    const handleBeforePrint = (): void => {
      showCheatDetectedMessage("Print attempted");
    };

    // Custom focus event handler to detect focus changes
    const customHandleFocus = (): void => {
      if (document.hasFocus()) {
        lastFocusTime.current = Date.now();
      } else {
        showCheatDetectedMessage("Focus lost");
      }
    };

    // Detect dev tools using console.log timing
    const detectDevTools = (): void => {
      if (strictMode) {
        const startTime = performance.now();
        // Using console.log can trigger a break in execution if dev tools are open
        console.log("");
        console.clear();
        const endTime = performance.now();

        // If execution took longer than expected, dev tools might be open
        if (endTime - startTime > 100) {
          setDevToolsOpened(true);
          showCheatDetectedMessage("Developer tools detected");
        }
      }
    };

    // Check for iframe embedding
    if (isIframe && strictMode) {
      showCheatDetectedMessage("Page is embedded in iframe");
    }

    // Add all event listeners

    const editor = document.getElementById("editor");

    if (editor) {
      editor.addEventListener("copy", handleCopy as EventListener);
      editor.addEventListener("paste", handlePaste as EventListener);
    }

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown as EventListener);
    document.addEventListener("mouseleave", handleMouseLeave as EventListener);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);
    document.addEventListener("copy", handleCopy as EventListener);
    document.addEventListener("paste", handlePaste as EventListener);
    window.addEventListener("beforeprint", handleBeforePrint);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleFocus);
    document.addEventListener("keypress", handleFocus as EventListener);

    // Set initial timestamps
    lastMouseMoveTime.current = Date.now();
    lastFocusTime.current = Date.now();

    // Set up periodic checks
    const devToolsCheckInterval = setInterval(detectDevTools, 1000);
    mouseCheckInterval.current = setInterval(checkMouseActivity, 5000); // Check mouse activity every 5 seconds
    focusCheckInterval.current = setInterval(checkFocusActivity, 5000); // Check focus activity every 5 seconds

    // Clean up all event listeners when component unmounts
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown as EventListener);
      document.removeEventListener(
        "mouseleave",
        handleMouseLeave as EventListener
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", customHandleFocus, false);
      window.addEventListener("blur", customHandleFocus, false);

      window.removeEventListener("resize", handleResize);
      document.removeEventListener("copy", handleCopy as EventListener);
      document.removeEventListener("paste", handlePaste as EventListener);
      window.removeEventListener("beforeprint", handleBeforePrint);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleFocus);
      document.removeEventListener("keypress", handleFocus as EventListener);
      clearInterval(devToolsCheckInterval);
      if (mouseCheckInterval.current) clearInterval(mouseCheckInterval.current);
      if (focusCheckInterval.current) clearInterval(focusCheckInterval.current);
    };
  }, [
    mouseLeaveCount,
    showMessage,
    onCheatDetected,
    allowedMouseLeaveCount,
    inactivityTimeoutSeconds,
    strictMode,
  ]);

  return <>{children}</>;
};

export default AntiCheatProtection;
