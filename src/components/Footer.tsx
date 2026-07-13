import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <p className="mx-auto max-w-4xl px-5 text-center text-sm text-muted">
        © {new Date().getFullYear()} {profile.name} / {profile.handle} 🐼
      </p>
    </footer>
  );
}
