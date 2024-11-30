import type { User } from "@/types/auth";

class StorageService {
  private readonly TOKEN_KEY = "token";
  private readonly USER_KEY = "user";

  // 基礎儲存操作
  private get(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }

  private set(key: string, value: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  }

  private remove(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }

  // Token 相關操作
  async setToken(token: string): Promise<void> {
    try {
      // 這裡可以加入加密邏輯
      this.set(this.TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting token:", error);
      throw error;
    }
  }

  getToken(): string | null {
    try {
      return this.get(this.TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  // User 相關操作
  async setUser(user: User): Promise<void> {
    try {
      this.set(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = this.get(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  // 清理所有數據
  async clear(): Promise<void> {
    try {
      this.remove(this.TOKEN_KEY);
      this.remove(this.USER_KEY);
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }

  // 可以添加其他輔助方法
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const storage = new StorageService();
