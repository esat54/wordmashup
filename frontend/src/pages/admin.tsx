import { useState } from "react";
import { useRouter } from "next/router";
import { grammarApi } from "@/lib/api";

export default function AdminPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({ category: "", title: "", formula: "", description: "", rules: "", notes: "", });

    // 2. Input Değişim Takibi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Kaydetme Fonksiyonu
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await grammarApi.createGrammar({ ...formData, isGlobal: true, });
            setMessage("✅ Başarıyla kaydedildi ve yayınlandı!");
            setFormData({ category: "", title: "", formula: "", description: "", rules: "", notes: "" });
        } catch (err: any) {
            setMessage("❌ Hata: " + (err.message || "Kaydedilemedi"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Global Gramer Ekle</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori *</label>
                        <input required name="category" value={formData.category} onChange={handleChange} type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Örn: Zamanlar" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Başlık *</label>
                        <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Örn: Present Perfect" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Formül</label>
                        <input name="formula" value={formData.formula} onChange={handleChange} type="text" className="w-full px-4 py-2 border rounded-lg bg-gray-50 font-mono" placeholder="S + have/has + V3" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Kısa Açıklama</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={2}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Kurallar</label>
                        <textarea name="rules" value={formData.rules} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={4}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Notlar</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                        {loading ? "Yayınlanıyor..." : "Global Gramer Olarak Yayınla"}
                    </button>
                </form>
            </div>
        </div>
    );
}