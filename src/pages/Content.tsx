import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Save, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const TABS = ["Hero", "Stats", "Testimonials", "Blog Posts"] as const;
type Tab = typeof TABS[number];

/* ── default values ── */
const DEFAULT_HERO = {
  eyebrow: "Become A Self-Published Author:",
  headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  subText:
    'Americanbookfounders team of experts will work very hard on your book, help you get it published, and make you a "stunning author." Join hands with the authentic and powerful team of creative book writers!',
  bullets: [
    "Not able to write a great manuscript?",
    "Are you frustrated with waiting for approvals?",
    "As a publisher, do you know what to do next?",
  ],
  phone: "+1 (800) 555-0199",
  ratingText: "Rated 9.1 out of 10",
  ratingCount: "3428",
};

const DEFAULT_STATS = [
  { number: "500+", label: "Books Published" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "50+", label: "Expert Writers" },
  { number: "10+", label: "Years Experience" },
];

const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "Working with American Book Founders was a transformative experience. They brought my story to life with an elegance I couldn't have imagined on my own.",
    name: "Sarah Johnson",
    title: "First-time Author",
    avatar: "/author-2.png",
  },
  {
    quote:
      "The ghostwriting team was incredibly professional and captured my voice perfectly. My business book hit the bestseller list within weeks of launch.",
    name: "Michael Rodriguez",
    title: "Business Author",
    avatar: "/author-3.png",
  },
  {
    quote:
      "From concept to publication, every step was seamless. Highly recommend their comprehensive publishing services to any aspiring author.",
    name: "Jennifer Lee",
    title: "Memoir Writer",
    avatar: "/author-4.png",
  },
];

const DEFAULT_BLOG = [
  {
    img: "/genre-memoir-1.png",
    category: "Ghostwriting",
    title: "How to Find the Right Ghostwriter for Your Book",
    excerpt:
      "Choosing a ghostwriter is one of the most important decisions you'll make as an author. Here's exactly what to look for — and what red flags to avoid.",
    author: "Sarah E. Collins",
    date: "May 15, 2024",
    readTime: "7 min read",
  },
  {
    img: "/genre-thriller-1.png",
    category: "Publishing",
    title: "Self-Publishing vs Traditional Publishing: The 2024 Guide",
    excerpt:
      "Both paths have their advantages. We break down royalties, timelines, creative control, and marketing requirements so you can make the right choice.",
    author: "Amanda R. Foster",
    date: "April 28, 2024",
    readTime: "9 min read",
  },
  {
    img: "/genre-fantasy-1.png",
    category: "Book Marketing",
    title: "10 Proven Strategies to Market Your Book on Amazon",
    excerpt:
      "Amazon is the world's biggest bookstore. Here are 10 strategies our marketing team uses to get books in front of the right readers — fast.",
    author: "Daniel H. Torres",
    date: "April 10, 2024",
    readTime: "11 min read",
  },
  {
    img: "/genre-horror-1.png",
    category: "Writing Tips",
    title: "How to Write a Compelling First Chapter That Hooks Readers",
    excerpt:
      "You have less than 30 seconds to convince a reader to keep going. Learn the techniques professional authors use to make the first page impossible to put down.",
    author: "Marcus D. Wright",
    date: "March 22, 2024",
    readTime: "8 min read",
  },
  {
    img: "/genre-scifi-1.png",
    category: "Editing",
    title: "The Difference Between Proofreading, Copy Editing, and Developmental Editing",
    excerpt:
      "Many authors don't know which type of editing their manuscript needs. We explain each stage clearly so you invest in exactly the right service.",
    author: "Marcus D. Wright",
    date: "March 5, 2024",
    readTime: "6 min read",
  },
  {
    img: "/genre-western-1.png",
    category: "Success Stories",
    title: "From Idea to Bestseller: Tom Rider's Publishing Journey",
    excerpt:
      "Tom came to us with a rough outline for a western. 8 months later, his debut novel hit the Amazon Western Top 10. Here's exactly how we did it.",
    author: "Lisa C. Nguyen",
    date: "February 18, 2024",
    readTime: "10 min read",
  },
];

/* ── shared UI components ── */
function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition"
        />
      )}
    </div>
  );
}

function SaveBar({ onSave, saving, saved }: { onSave: () => void; saving: boolean; saved: boolean }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div />
      <div className="flex items-center gap-3">
        {saved && <span className="text-green-600 text-sm font-medium">Saved!</span>}
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-navy font-bold text-sm px-5 py-2.5 rounded-xl transition disabled:opacity-60"
          style={{ color: "#07082a" }}
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── Hero editor ── */
type HeroData = typeof DEFAULT_HERO;

function HeroEditor() {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent("hero").then((res) => {
      if (res) setData(res.value as HeroData);
    });
  }, []);

  function set(field: keyof HeroData, value: unknown) {
    setData((d) => ({ ...d, [field]: value }));
    setSaved(false);
  }

  function updateBullet(i: number, v: string) {
    const bullets = [...data.bullets];
    bullets[i] = v;
    set("bullets", bullets);
  }

  function addBullet() {
    set("bullets", [...data.bullets, ""]);
  }

  function removeBullet(i: number) {
    set("bullets", data.bullets.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await api.saveContent("hero", data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SaveBar onSave={save} saving={saving} saved={saved} />
      <div className="space-y-4">
        <Field label="Eyebrow (small text above headline)" value={data.eyebrow} onChange={(v) => set("eyebrow", v)} />
        <Field label="Headline" value={data.headline} onChange={(v) => set("headline", v)} multiline />
        <Field label="Sub-text" value={data.subText} onChange={(v) => set("subText", v)} multiline />
        <Field label="Phone Number" value={data.phone} onChange={(v) => set("phone", v)} placeholder="+1 (800) 000-0000" />
        <Field label="Rating Text (e.g. Rated 9.1 out of 10)" value={data.ratingText} onChange={(v) => set("ratingText", v)} />
        <Field label="Rating Customer Count" value={data.ratingCount} onChange={(v) => set("ratingCount", v)} placeholder="3428" />

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Bullet Points
          </label>
          <div className="space-y-2">
            {data.bullets.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => updateBullet(i, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition"
                />
                <button
                  onClick={() => removeBullet(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addBullet}
            className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
          >
            <Plus className="w-4 h-4" /> Add bullet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Stats editor ── */
type StatItem = { number: string; label: string };

function StatsEditor() {
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getContent("stats").then((res) => {
      if (res) setStats(res.value as StatItem[]);
    });
  }, []);

  function update(i: number, field: keyof StatItem, v: string) {
    const next = stats.map((s, idx) => (idx === i ? { ...s, [field]: v } : s));
    setStats(next);
    setSaved(false);
  }

  function add() {
    setStats((s) => [...s, { number: "", label: "" }]);
    setSaved(false);
  }

  function remove(i: number) {
    setStats((s) => s.filter((_, idx) => idx !== i));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await api.saveContent("stats", stats);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SaveBar onSave={save} saving={saving} saved={saved} />
      <div className="space-y-3">
        {stats.map((s, i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-4">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field label="Number / Value" value={s.number} onChange={(v) => update(i, "number", v)} placeholder="500+" />
              <Field label="Label" value={s.label} onChange={(v) => update(i, "label", v)} placeholder="Books Published" />
            </div>
            <button onClick={() => remove(i)} className="mt-6 p-2 rounded-lg text-red-400 hover:bg-red-100 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={add}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add stat
        </button>
      </div>
    </div>
  );
}

/* ── Testimonials editor ── */
type TestimonialItem = { quote: string; name: string; title: string; avatar: string };

function TestimonialsEditor() {
  const [items, setItems] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    api.getContent("testimonials").then((res) => {
      if (res) setItems(res.value as TestimonialItem[]);
    });
  }, []);

  function update(i: number, field: keyof TestimonialItem, v: string) {
    setItems((arr) => arr.map((t, idx) => (idx === i ? { ...t, [field]: v } : t)));
    setSaved(false);
  }

  function add() {
    setItems((arr) => [...arr, { quote: "", name: "", title: "", avatar: "/author-1.png" }]);
    setExpanded(items.length);
    setSaved(false);
  }

  function remove(i: number) {
    setItems((arr) => arr.filter((_, idx) => idx !== i));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await api.saveContent("testimonials", items);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SaveBar onSave={save} saving={saving} saved={saved} />
      <div className="space-y-2">
        {items.map((t, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="font-semibold text-sm text-gray-700">
                {t.name || `Testimonial ${i + 1}`}
                {t.title ? <span className="text-gray-400 font-normal ml-2">· {t.title}</span> : null}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  className="p-1 rounded text-red-400 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                <Field label="Quote" value={t.quote} onChange={(v) => update(i, "quote", v)} multiline />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name" value={t.name} onChange={(v) => update(i, "name", v)} />
                  <Field label="Title / Role" value={t.title} onChange={(v) => update(i, "title", v)} placeholder="First-time Author" />
                </div>
                <Field label="Avatar image path" value={t.avatar} onChange={(v) => update(i, "avatar", v)} placeholder="/author-1.png" />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={add}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add testimonial
        </button>
      </div>
    </div>
  );
}

/* ── Blog Posts editor ── */
type BlogPost = {
  img: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
};

function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_BLOG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    api.getContent("blog").then((res) => {
      if (res) setPosts(res.value as BlogPost[]);
    });
  }, []);

  function update(i: number, field: keyof BlogPost, v: string) {
    setPosts((arr) => arr.map((p, idx) => (idx === i ? { ...p, [field]: v } : p)));
    setSaved(false);
  }

  function add() {
    setPosts((arr) => [
      ...arr,
      { img: "/genre-memoir-1.png", category: "", title: "", excerpt: "", author: "", date: "", readTime: "" },
    ]);
    setExpanded(posts.length);
    setSaved(false);
  }

  function remove(i: number) {
    setPosts((arr) => arr.filter((_, idx) => idx !== i));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await api.saveContent("blog", posts);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SaveBar onSave={save} saving={saving} saved={saved} />
      <div className="space-y-2">
        {posts.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="font-semibold text-sm text-gray-700 truncate max-w-xs">
                {p.title || `Post ${i + 1}`}
                {p.category ? <span className="text-gray-400 font-normal ml-2">· {p.category}</span> : null}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); remove(i); }}
                  className="p-1 rounded text-red-400 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>
            {expanded === i && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                <Field label="Title" value={p.title} onChange={(v) => update(i, "title", v)} />
                <Field label="Excerpt" value={p.excerpt} onChange={(v) => update(i, "excerpt", v)} multiline />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category" value={p.category} onChange={(v) => update(i, "category", v)} placeholder="Ghostwriting" />
                  <Field label="Author" value={p.author} onChange={(v) => update(i, "author", v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date" value={p.date} onChange={(v) => update(i, "date", v)} placeholder="May 15, 2024" />
                  <Field label="Read Time" value={p.readTime} onChange={(v) => update(i, "readTime", v)} placeholder="7 min read" />
                </div>
                <Field label="Image path" value={p.img} onChange={(v) => update(i, "img", v)} placeholder="/genre-memoir-1.png" />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={add}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <Plus className="w-4 h-4" /> Add post
        </button>
      </div>
    </div>
  );
}

/* ── Main Content page ── */
export default function Content() {
  const [tab, setTab] = useState<Tab>("Hero");

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
        <p className="text-gray-500 text-sm mt-0.5">Edit the content displayed on your website</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition -mb-px border-b-2 ${
              tab === t
                ? "border-yellow-400 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Hero" && <HeroEditor />}
      {tab === "Stats" && <StatsEditor />}
      {tab === "Testimonials" && <TestimonialsEditor />}
      {tab === "Blog Posts" && <BlogEditor />}
    </div>
  );
}
