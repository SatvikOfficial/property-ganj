"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Link from "next/link";

// Simple Project Search Page – fetches projects based on query param 'q'
export default function ProjectSearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch(`/api/projects?search=${encodeURIComponent(query)}&limit=20`);
                const data = await res.json();
                if (res.ok) {
                    setProjects(data.projects || []);
                } else {
                    console.error("Failed to fetch projects", data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [query]);

    if (loading) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12">Loading...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <Header />
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Project Search Results for "{query}"</h1>
                {projects.length === 0 ? (
                    <p>No projects found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link
                                key={project._id}
                                href={`/projects/${project._id}`}
                                className="card-premium group cursor-pointer overflow-hidden"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.coverImage || "/placeholder.svg"}
                                        alt={project.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-primary font-bold mb-1">
                                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(project.priceRange?.min || 0)} -
                                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(project.priceRange?.max || 0)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
