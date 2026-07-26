"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Do I need a seed phrase?",
    a: "No. GlazeWallet uses ERC-4337 smart accounts powered by the Coinbase Developer Platform. Your wallet is recoverable via your @username and secured by your Mac's Secure Enclave — not a 12-word phrase you have to write down and hide.",
  },
  {
    q: "How is this different from a browser extension wallet?",
    a: "Browser extensions live inside Chrome and are exposed to every tab you open. GlazeWallet is a native macOS app — keys are isolated in the macOS sandbox, transactions are signed locally, and the UI runs at native speed with menu bar integration and keyboard shortcuts.",
  },
  {
    q: "What does \"gasless\" actually mean?",
    a: "GlazeWallet uses custom paymasters to sponsor your transaction gas costs. You can swap, trade, and transfer without holding ETH for gas. On launch, gas is fully sponsored — you pay nothing.",
  },
  {
    q: "Is my money safe if my Mac is lost or stolen?",
    a: "Your keys never leave the Secure Enclave. Without your passcode or Touch ID, no one can sign transactions. Because your account is a smart account (ERC-4337), you can also recover access from a new device using your @username and social recovery.",
  },
  {
    q: "Which chains and tokens are supported?",
    a: "GlazeWallet launches with full support for Base and Ethereum mainnet, including any ERC-20 token. Additional chains are rolling out continuously.",
  },
  {
    q: "What does it cost?",
    a: "GlazeWallet is free to install and use. Swaps carry 0% fees on launch. Gas is sponsored — you pay nothing to transact.",
  },
  {
    q: "Can I use my existing wallet?",
    a: "Yes. You can import an existing wallet via private key or connect a hardware wallet. However, the gasless and smart-account features work best with a native GlazeWallet smart account.",
  },
  {
    q: "What macOS version do I need?",
    a: "GlazeWallet requires macOS 14 (Sonoma) or later on Apple Silicon (M1 or newer). This ensures full Secure Enclave and biometric support.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-2">
            FAQ
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="glaze-text-gradient">Questions, answered.</span>
          </h2>
        </div>

        {/* Items */}
        <div className="mt-12 flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.q}
              question={faq.q}
              answer={faq.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl glaze-glass transition-colors hover:glaze-glass-strong">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-foreground sm:text-base">
          {question}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}
