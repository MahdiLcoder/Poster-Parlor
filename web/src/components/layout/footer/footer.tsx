"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShieldCheck, FileText, Cookie, Map } from "lucide-react";

type DialogType = "privacy" | "terms" | "cookies" | "sitemap";

interface FooterDialogContent {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const dialogContents: Record<DialogType, FooterDialogContent> = {
  privacy: {
    title: "Privacy Policy",
    icon: <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400" />,
    content: (
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Information We Collect
          </h4>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support. This
            may include your name, email address, shipping address, and payment
            information.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            How We Use Your Information
          </h4>
          <p>
            We use the information we collect to process your orders, send you
            updates about your purchases, improve our services, and communicate
            with you about promotions and new products.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Data Protection
          </h4>
          <p>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. Your data is encrypted and stored securely.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Your Rights
          </h4>
          <p>
            You have the right to access, correct, or delete your personal
            information at any time. Contact us if you wish to exercise these
            rights or have any questions about our privacy practices.
          </p>
        </section>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    icon: <FileText className="size-5 text-purple-600 dark:text-purple-400" />,
    content: (
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Acceptance of Terms
          </h4>
          <p>
            By accessing and using Posterparlor, you accept and agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use our services.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Use of Services
          </h4>
          <p>
            You agree to use our services only for lawful purposes. You may not
            use our platform to engage in any activity that violates local,
            state, national, or international laws.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Orders and Payments
          </h4>
          <p>
            All orders are subject to availability and confirmation. We reserve
            the right to refuse or cancel any order at our discretion. Prices
            are subject to change without notice.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Intellectual Property
          </h4>
          <p>
            All content on this website, including images, designs, and text, is
            the property of Posterparlor and protected by copyright laws.
            Unauthorized reproduction is strictly prohibited.
          </p>
        </section>
      </div>
    ),
  },
  cookies: {
    title: "Cookie Policy",
    icon: <Cookie className="size-5 text-pink-600 dark:text-pink-400" />,
    content: (
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            What Are Cookies?
          </h4>
          <p>
            Cookies are small text files stored on your device when you visit
            our website. They help us provide you with a better experience by
            remembering your preferences and login status.
          </p>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Types of Cookies We Use
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Essential Cookies:</strong> Required for the website to
              function properly
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how
              visitors use our site
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and
              preferences
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant
              advertisements
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Managing Cookies
          </h4>
          <p>
            You can control and manage cookies through your browser settings.
            Please note that disabling certain cookies may affect the
            functionality of our website.
          </p>
        </section>
      </div>
    ),
  },
  sitemap: {
    title: "Site Map",
    icon: <Map className="size-5 text-green-600 dark:text-green-400" />,
    content: (
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Main Pages
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/posters"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse Posters
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Account
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/myorder"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                My Orders
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Shopping
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <Link
                href="/checkout"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Checkout
              </Link>
            </li>
          </ul>
        </section>
      </div>
    ),
  },
};

function FooterDialog({ type }: { type: DialogType }) {
  const { title, icon, content } = dialogContents[type];
  const label =
    type === "sitemap"
      ? "Sitemap"
      : type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group cursor-pointer">
          {label}
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">{content}</div>
      </DialogContent>
    </Dialog>
  );
}

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "relative bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800",
        className
      )}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          {/* Left Section - Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="group">
              <h3 className="text-xl md:text-2xl font-bold transition-all duration-500">
                Posterparlor
              </h3>
            </Link>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Center Section - Tagline (hidden on mobile) */}
          <div className="hidden lg:block">
            <p className="text-sm text-gray-500 dark:text-gray-500 italic">
              Discover posters that match your vibe.
            </p>
          </div>

          {/* Right Section - Dialog Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <FooterDialog type="privacy" />
            <FooterDialog type="terms" />
            <FooterDialog type="cookies" />
            <FooterDialog type="sitemap" />
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-8 flex justify-center gap-2 opacity-30">
          <div className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
      </div>
    </footer>
  );
}
