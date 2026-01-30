import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20">
      {/* TOP FOOTER */}
      <div className="bg-gradient-to-r from-black via-zinc-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">WeBLOG</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-6">
            Discover insights, stories, and ideas from our community. Stay
            informed with the latest articles, trends, and in-depth analysis.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="hover:text-blue-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href="#"
              className="hover:text-sky-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="size-5" />
            </a>
            <a
              href="#"
              className="hover:text-red-500 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="size-5" />
            </a>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="bg-black text-gray-400 text-sm text-center py-4">
        © {new Date().getFullYear()} WeBLOG. Designed by{" "}
        <a
          href="https://www.ryanannda.my.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium hover:underline hover:text-blue-400 transition"
        >
          Riyan Ananda
        </a>
      </div>
    </footer>
  );
}
