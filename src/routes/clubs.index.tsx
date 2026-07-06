import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/clubs/")({
  head: () => ({
    meta: [
      { title: "Club directory — CampusConnect" },
      { name: "description", content: "Discover student clubs, tech communities, and societies on your campus." },
    ],
  }),
  component: ClubsIndex,
});

function ClubsIndex() {
  const supabase = createClient();
  const [search, setSearch] = useState("");

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const { data } = await supabase.from("clubs").select(`
        id, name, slug, description,
        club_members (id)
      `);
      return data || [];
    },
  });

  const colors = ["bg-lime", "bg-sky", "bg-lavender", "bg-peach"];
  
  const filteredClubs = clubs.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SiteShell>
      <section className="border-b-2 border-black bg-lavender px-4 py-14 md:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow font-bold">Club directory · {clubs.length} active</p>
          <h1 className="mt-2 text-4xl font-bold md:text-6xl">Find your people.</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs by name or interest..."
            className="neu-border mt-6 w-full max-w-xl bg-white px-4 py-3 font-mono text-sm outline-none"
          />
        </div>
      </section>
      <section className="bg-cream px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full font-mono py-10">Loading clubs...</div>
          ) : filteredClubs.map((c, index) => {
            const members = Array.isArray(c.club_members) ? c.club_members.length : 0;
            return (
              <Link
                key={c.slug}
                to="/clubs/$slug"
                params={{ slug: c.slug }}
                className="neu-border neu-press block bg-white p-6"
              >
                <div className={`neu-border ${colors[index % colors.length]} mb-4 inline-block px-3 py-1 font-mono text-xs font-bold uppercase`}>
                  Club
                </div>
                <h2 className="text-2xl font-bold">{c.name}</h2>
                <div className="my-3 border-t-2 border-black" />
                <div className="flex items-center justify-between font-mono text-xs">
                  <span>{members} members</span>
                  <span className="font-bold uppercase">View →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}