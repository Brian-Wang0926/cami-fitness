// frontend/src/lib/logger.ts
export type LogLevel = "info" | "warn" | "error";

interface LogData {
  level: LogLevel;
  message: string;
  data?: unknown;
  callerInfo: string;
  timestamp: string;
  url: string;
}

export class Logger {
  private static instance: Logger;

  // 使用私有建構函式確保單例模式
  private constructor() {}

  // 使用箭頭函式避免 this 綁定問題
  static getInstance = () => {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  };

  private getCallerInfo = (): string => {
    try {
      const error = new Error();
      const stackLines = error.stack?.split("\n");
      if (!stackLines) return "unknown";

      const callerLine = stackLines.find(
        (line) => line.includes("/src/") && !line.includes("/logger.ts")
      );

      if (!callerLine) return "unknown";

      const match = callerLine.match(/\/src\/(.+?):(\d+):/);
      return match ? `${match[1]}:${match[2]}` : "unknown";
    } catch {
      return "unknown";
    }
  };

  // private sendToServer = async (logData: LogData): Promise<void> => {
  //   try {
  //     await fetch("/api/logs", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(logData),
  //     });
  //   } catch (error) {
  //     console.error("Failed to send log:", error);
  //   }
  // };

  private createLogData = (
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogData => ({
    level,
    message,
    data,
    callerInfo: this.getCallerInfo(),
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.pathname : "",
  });

  log = (message: string, data?: unknown): void => {
    const logData = this.createLogData("info", message, data);

    if (process.env.NODE_ENV === "development") {
      console.log(`[LOG][${logData.callerInfo}] ${message}`, data);
    }

    // this.sendToServer(logData);
  };

  warn = (message: string, data?: unknown): void => {
    const logData = this.createLogData("warn", message, data);

    if (process.env.NODE_ENV === "development") {
      console.warn(`[WARN][${logData.callerInfo}] ${message}`, data);
    }

    // this.sendToServer(logData);
  };

  error = (message: string, error?: unknown): void => {
    const logData = this.createLogData("error", message, error);

    console.error(`[ERROR][${logData.callerInfo}] ${message}`, error);
    // this.sendToServer(logData);
  };
}

// 導出單例實例
export const logger = Logger.getInstance();
