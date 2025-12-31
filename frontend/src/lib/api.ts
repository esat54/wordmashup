const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers, // Dışarıdan özel header gelirse onları da ekle
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response) {
            throw new Error("Backend sunucusuna bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.");
        }

        const contentType = response.headers.get("content-type");
        let data;

        if (contentType && contentType.includes("application/json")) {
            try {
                const text = await response.text();
                if (!text) {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    throw new Error("Sunucudan boş yanıt alındı.");
                }
                data = JSON.parse(text);
            } catch (parseError: any) {
                console.error("JSON parse error:", parseError);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                throw new Error(`Sunucudan geçersiz yanıt alındı: ${parseError.message}`);
            }
        } else {
            const text = await response.text();
            if (!response.ok) {
                if (text.includes("<!DOCTYPE html>") || text.includes("<html")) {
                    throw new Error(`Backend route bulunamadı (${response.status}). Backend sunucusunu kontrol edin.`);
                }
                throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
            }
            return text as any;
        }

        if (!response.ok) {
            const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
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

    changePassword: (data: { currentPassword: string; newPassword: string }) => {
        return apiRequest("/api/auth/change-password", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getUserInfo: () => {
        return apiRequest("/api/auth/me", {
            method: "GET",
        });
    },
};



export const wordsApi = {

    addWord: (data: { text: string; translation: string; exampleSentence: string; sentenceTranslation: string; type: string }) => {
        return apiRequest("/api/words", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getWords: (params: {
        limit?: number; type?: string; favoriteFilter?: string; unknownFilter?: string; searchTerm?: string;
    } = {}) => {
        const { limit = 20, type = "", favoriteFilter = "", unknownFilter = "", searchTerm = "", } = params;
        return apiRequest(
            `/api/words?limit=${limit}&type=${type}&favoriteFilter=${favoriteFilter}&unknownFilter=${unknownFilter}&search=${searchTerm}`,
            { method: "GET" }
        );
    },


    addtoFavorites: (wordId: string) => {
        return apiRequest(`/api/words/${wordId}/favorite`, {
            method: "POST",
        });
    },

    addtoUnknown: (wordId: string) => {
        return apiRequest(`/api/words/${wordId}/unknown`, {
            method: "POST",
        });
    },


    deleteWord: (wordId: string) => {
        return apiRequest(`/api/words/${wordId}`, {
            method: "DELETE",
        });
    }
}



export const dictionaryApi = {

    analyzeWord: (word: string) => {
        return apiRequest("/api/dictionary/analyze", {
            method: "POST",
            body: JSON.stringify({ word }),
        });
    },
};