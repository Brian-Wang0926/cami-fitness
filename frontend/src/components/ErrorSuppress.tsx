// frontend/src/components/ErrorSuppress.tsx
"use client";

import { useEffect } from "react";

export function ErrorSuppress() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 保存原始的 console 方法
      const originalConsole = {
        error: console.error,
        warn: console.warn,
      };

      // 過濾規則
      const filterPatterns = [
        /Cannot update a component/,
        /Using kebab-case/,
        /Request Header Fields Too Large/,
        /React does not recognize/,
        /WebkitTextFillColor/,
        /MUI: The `css` prop is not supported/,
      ];

      // 重寫 console.error
      console.error = (...args) => {
        const shouldSuppress = filterPatterns.some(
          (pattern) => typeof args[0] === "string" && pattern.test(args[0])
        );

        if (!shouldSuppress) {
          originalConsole.error.apply(console, args);
        }
      };

      // 重寫 console.warn
      console.warn = (...args) => {
        const shouldSuppress = filterPatterns.some(
          (pattern) => typeof args[0] === "string" && pattern.test(args[0])
        );

        if (!shouldSuppress) {
          originalConsole.warn.apply(console, args);
        }
      };

      // 清理函數
      return () => {
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
      };
    }
  }, []);

  return null;
}
