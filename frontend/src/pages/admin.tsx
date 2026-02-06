"use client";

import SeoHead from "@/components/SeoHead";

export default function AdminPage() {
    return (
        <>
            <SeoHead
                title="Admin Panel"
                description="WordMashup yönetim paneli"
                noindex={true}
            />
            <div>
                Admin Page 
            </div>
        </>
    );
}