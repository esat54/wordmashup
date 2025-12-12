const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        if (!response) {
            throw new Error("Backend sunucusuna bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.");
        }

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            throw new Error("Sunucudan geçersiz yanıt alındı.");
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || "Bir hata oluştu");
        }

        return data;
    } catch (error: any) {
        if (error.message === "Failed to fetch" || error.name === "TypeError") {
            throw new Error("Backend sunucusuna bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.");
        }
        throw error;
    }
}

export const authApi = {
    
    register: (data: { name: string; email: string; password: string }) =>
        apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
