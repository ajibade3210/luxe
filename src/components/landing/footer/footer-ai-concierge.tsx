import { Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
import type { AiPrompt } from "@/types";

const AI_PROMPTS: AiPrompt[] = [
  {
    label: "Proposal Engine",
    icon: "✦",
    question: "How does Shopwus calculate multi-day production margins?",
    answer:
      "Shopwus auto-calculates vendor cost baselines, staffing tiers, contingency buffers, and custom markup formulas in real-time. Proposals dynamic-link to live budgets so your studio never absorbs unexpected vendor price surges.",
  },
  {
    label: "VIP Client Portal",
    icon: "✧",
    question: "What does the client VIP onboarding experience look like?",
    answer:
      "Clients receive an encrypted, white-labeled portal showcasing curated moodboards, interactive design decisions, digital signature milestones, and direct messaging—eliminating 50+ messy email threads.",
  },
  {
    label: "Multi-Channel Sync",
    icon: "◇",
    question: "Can I sync 10+ social accounts and live event galleries?",
    answer:
      "Yes. Shopwus connects directly to Instagram, TikTok, Pinterest, YouTube, and Vimeo. Published events automatically update your public portfolio with high-resolution imagery and vendor credits.",
  },
  {
    label: "Live Run of Show",
    icon: "✺",
    question: "How does real-time team cueing work during gala events?",
    answer:
      "Your on-site production team and AV vendors receive live synchronized timelines on iOS & iPadOS. Broadcast instant cue adjustments, vendor call times, and VIP arrival alerts with zero latency.",
  },
];

export function FooterAiConcierge() {
  const [activePrompt, setActivePrompt] = useState<AiPrompt | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    setIsAiThinking(true);
    setCustomAnswer(null);
    setTimeout(() => {
      setIsAiThinking(false);
      setCustomAnswer(
        `Shopwus seamlessly coordinates ${customQuestion.toLowerCase().includes("budget") ? "production budgets, currency conversions, and automated vendor milestone payouts" : customQuestion.toLowerCase().includes("client") ? "private client confidentiality, bespoke deck styling, and encrypted proposal approvals" : "luxury event workflows, multi-channel portfolio distribution, and high-touch VIP client experiences"} with dedicated atelier-grade tooling.`
      );
    }, 600);
  };

  return (
    <div className="footer-ai-section">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="footer-ai-badge">
            <Sparkles size={12} className="text-[#a87d46]" />
            <span>AI Concierge</span>
          </span>
          <span className="text-xs text-[#747878]">Ask about Shopwus</span>
        </div>
        {activePrompt && (
          <button
            type="button"
            onClick={() => {
              setActivePrompt(null);
              setCustomAnswer(null);
            }}
            className="text-xs text-[#747878] hover:text-[#191c1d] flex items-center gap-1 cursor-pointer"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="footer-prompt-chips">
        {AI_PROMPTS.map(p => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setActivePrompt(p);
              setCustomAnswer(null);
            }}
            className={`footer-prompt-chip ${activePrompt?.label === p.label ? "is-active" : ""}`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {activePrompt && (
        <div className="footer-ai-response-box">
          <p className="text-xs font-semibold text-[#855e2e] mb-1">Q: {activePrompt.question}</p>
          <p className="text-xs text-[#444748] leading-relaxed">{activePrompt.answer}</p>
        </div>
      )}

      <form onSubmit={handleAskCustom} className="footer-ai-input-form mt-2.5">
        <div className="footer-ai-input-wrapper">
          <input
            type="text"
            placeholder="Ask AI anything about our platform…"
            value={customQuestion}
            onChange={e => setCustomQuestion(e.target.value)}
            className="footer-ai-input"
          />
          <button
            type="submit"
            disabled={isAiThinking || !customQuestion.trim()}
            className="footer-ai-send-btn"
          >
            <Zap size={13} className={isAiThinking ? "animate-pulse" : ""} />
          </button>
        </div>
      </form>

      {customAnswer && (
        <div className="footer-ai-response-box mt-2">
          <p className="text-xs text-[#444748] leading-relaxed">{customAnswer}</p>
        </div>
      )}
    </div>
  );
}
