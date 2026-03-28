import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Mic,
  MicOff,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Headphones,
  Activity,
  Languages,
  AlertTriangle,
} from "lucide-react";

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "ru-RU", label: "Russian" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "ar-SA", label: "Arabic" },
  { code: "hi-IN", label: "Hindi" },
];

const TARGET_LANGUAGES = [
  { code: "original", label: "Original Transcript" },
  ...LANGUAGES,
];

const coachingModes = {
  discovery: {
    title: "Discovery Mode",
    keywords: ["coverage", "family", "protect", "policy", "today"],
    script:
      "Ask: 'What made you want to look into coverage today?' Then ask: 'If something happened, who would feel the financial impact the most?'",
    tip: "Slow down and ask one short question at a time.",
  },
  price: {
    title: "Price Objection",
    keywords: ["expensive", "cost", "price", "afford", "payment"],
    script:
      "Say: 'I understand. Most people compare this to the financial problem it solves, not just the monthly payment. Would you like me to show you a more comfortable option?'",
    tip: "Find out if the issue is amount, timing, or budget comfort.",
  },
  think: {
    title: "Need To Think",
    keywords: ["think", "later", "not sure", "maybe"],
    script:
      "Say: 'Absolutely. Usually that means there’s one part you want to feel better about first. Is it the payment, the coverage, or the timing?'",
    tip: "Get the real objection before ending the call.",
  },
  spouse: {
    title: "Spouse Objection",
    keywords: ["wife", "husband", "spouse", "partner"],
    script:
      "Say: 'That makes sense. What do you think your spouse would want to understand first: price, coverage, or timing?'",
    tip: "Offer a three-way call or a scheduled follow-up.",
  },
  close: {
    title: "Close Mode",
    keywords: ["yes", "sounds good", "let's do it", "start", "move forward"],
    script:
      "Say: 'Based on what you told me, this looks like the option that best matches what you want to protect. Let’s go ahead and get the application started.'",
    tip: "Move one step at a time and do not keep re-selling after agreement.",
  },
};

function detectMode(text) {
  const lower = text.toLowerCase();

  for (const [key, value] of Object.entries(coachingModes)) {
    if (value.keywords.some((word) => lower.includes(word))) {
      return key;
    }
  }

  return "discovery";
}

function estimateTalkRatio(lines) {
  if (!lines.length) return 50;

  let clientWords = 0;
  let agentWords = 0;

  for (const line of lines) {
    const count = line.text.split(/\s+/).filter(Boolean).length;

    if (line.speaker === "Client") clientWords += count;
    if (line.speaker === "Agent") agentWords += count;
  }

  const total = clientWords + agentWords;
  if (!total) return 50;

  return Math.round((agentWords / total) * 100);
}

export default function SalesCoachPage() {
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
const API_URL = import.meta.env.VITE_API_URL || "";
  const [supported, setSupported] = useState(true);
  const [micReady, setMicReady] = useState(false);
  const [listening, setListening] = useState(false);
  const [mode, setMode] = useState("discovery");
  const [sourceLanguage, setSourceLanguage] = useState("en-US");
  const [targetLanguage, setTargetLanguage] = useState("original");
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [interimText, setInterimText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const active = coachingModes[mode];
  const talkRatio = useMemo(() => estimateTalkRatio(transcriptLines), [transcriptLines]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalText = "";
      let liveText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0]?.transcript?.trim() || "";

        if (!text) continue;

        if (event.results[i].isFinal) {
          finalText += `${text} `;
        } else {
          liveText += `${text} `;
        }
      }

      setInterimText(liveText.trim());

      if (finalText.trim()) {
        const lineText = finalText.trim();

        setTranscriptLines((prev) => {
          const speaker = lineText.endsWith("?") ? "Agent" : "Client";
          return [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              speaker,
              text: lineText,
            },
          ];
        });

        setMode(detectMode(lineText));
      }
    };

    recognition.onerror = (event) => {
      setErrorText(event.error || "Speech recognition error");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [sourceLanguage]);

  useEffect(() => {
    const combined = transcriptLines.map((line) => `${line.speaker}: ${line.text}`).join("\n");

    if (!combined) {
      setTranslatedText("");
      return;
    }

    if (targetLanguage === "original" || targetLanguage === sourceLanguage) {
      setTranslatedText(combined);
      return;
    }

    let cancelled = false;

    async function runTranslation() {
      setIsTranslating(true);

      try {
        const API_URL = import.meta.env.VITE_API_URL || "";

const response = await fetch(`${API_URL}/api/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: combined,
            sourceLanguage,
            targetLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error("Translation service not connected yet.");
        }

        const data = await response.json();

        if (!cancelled) {
          setTranslatedText(data.translatedText || combined);
        }
      } catch {
        if (!cancelled) {
          setTranslatedText(
            "Translation route not connected yet. Transcript is still live in the original language."
          );
        }
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    }

    runTranslation();

    return () => {
      cancelled = true;
    };
  }, [transcriptLines, sourceLanguage, targetLanguage]);

  async function prepareMic() {
    setErrorText("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicReady(true);
    } catch (error) {
      setErrorText(
        error?.message || "Microphone permission was denied or unavailable."
      );
    }
  }

  async function startListening() {
    if (!supported) {
      setErrorText("Speech recognition is not supported in this browser.");
      return;
    }

    if (!micReady) {
      await prepareMic();
    }

    try {
      recognitionRef.current.lang = sourceLanguage;
      recognitionRef.current.start();
      setListening(true);
      setErrorText("");
    } catch (error) {
      setErrorText(error?.message || "Could not start speech recognition.");
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setMicReady(false);
    setListening(false);
  }

  function clearTranscript() {
    setTranscriptLines([]);
    setInterimText("");
    setTranslatedText("");
    setMode("discovery");
    setErrorText("");
  }

  const fullTranscript = transcriptLines
    .map((line) => `${line.speaker}: ${line.text}`)
    .join("\n");

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Sales Coach</h1>
          <p className="page-subtitle">
            Live call transcription, instant coaching prompts, and language switching for multilingual conversations.
          </p>
        </div>
      </div>

      {!supported && (
        <div className="glass-card" style={{ marginBottom: 18 }}>
          <div className="card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlertTriangle size={18} />
              <strong>Speech recognition is not available in this browser.</strong>
            </div>
            <div className="carrier-meta" style={{ marginTop: 10 }}>
              This page uses the browser’s Web Speech recognition support. Test on a supported browser and run the app on localhost or HTTPS.
            </div>
          </div>
        </div>
      )}

      <div className="grid-cards" style={{ marginBottom: 18 }}>
        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Coach Status</div>
                <div className="stat-value">{listening ? "Listening" : "Idle"}</div>
              </div>
              <div className="stat-icon">
                <Brain size={22} />
              </div>
            </div>
            <div className="stat-change">
              Real mic + live browser transcription
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Detected Mode</div>
                <div className="stat-value">{active.title}</div>
              </div>
              <div className="stat-icon">
                <MessageSquare size={22} />
              </div>
            </div>
            <div className="stat-change">
              Updates from transcript keywords
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Agent Talk Ratio</div>
                <div className="stat-value">{talkRatio}%</div>
              </div>
              <div className="stat-icon">
                <Activity size={22} />
              </div>
            </div>
            <div className="stat-change">
              Lower this when you need more discovery
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-pad">
            <div className="stat-row">
              <div>
                <div className="stat-label">Compliance Guard</div>
                <div className="stat-value">Active</div>
              </div>
              <div className="stat-icon">
                <ShieldCheck size={22} />
              </div>
            </div>
            <div className="stat-change">
              Keep claims accurate and non-guaranteed
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid" style={{ alignItems: "start" }}>
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-pad">
            <div className="panel-title">Live Call Controls</div>

            <div className="section-spacing" style={{ display: "grid", gap: 12 }}>
              <div className="drawer-info-card">
                <div className="coach-label">Recognition Language</div>
                <div style={{ marginTop: 8 }}>
                  <select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    className="coach-select"
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="drawer-info-card">
                <div className="coach-label">Translator Output</div>
                <div style={{ marginTop: 8 }}>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="coach-select"
                  >
                    {TARGET_LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="carrier-card-actions">
                <button className="primary-btn" onClick={startListening} disabled={listening}>
                  <Mic size={16} />
                  Start Listening
                </button>

                <button className="small-btn" onClick={stopListening} disabled={!listening}>
                  <MicOff size={16} />
                  Stop
                </button>

                <button className="small-btn" onClick={clearTranscript}>
                  Clear
                </button>
              </div>

              {errorText && (
                <div className="note-card">
                  <div className="carrier-meta">{errorText}</div>
                </div>
              )}
            </div>

            <div className="section-spacing">
              <div className="panel-title">Live Coaching</div>

              <div className="coach-card">
                <div className="coach-label">Detected Situation</div>
                <div className="carrier-meta">{active.title}</div>
              </div>

              <div className="coach-card">
                <div className="coach-label">What To Say Right Now</div>
                <div className="pipeline-name" style={{ lineHeight: 1.5 }}>
                  {active.script}
                </div>
              </div>

              <div className="coach-card">
                <div className="coach-label">Immediate Tip</div>
                <div className="carrier-meta">{active.tip}</div>
              </div>

              <div className="coach-card">
                <div className="coach-label">Live Prompt Box</div>
                <div className="coach-prompt-main">{active.script}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <div className="card-pad">
            <div className="panel-title">Transcript Console</div>

            <div className="coach-transcript-box section-spacing">
              {transcriptLines.length === 0 && !interimText && (
                <div className="activity-meta">
                  Start listening to see the live transcript here.
                </div>
              )}

              {transcriptLines.map((line) => (
                <div key={line.id} className="activity-item" style={{ marginBottom: 10 }}>
                  <div className="pipeline-name">{line.speaker}</div>
                  <div className="activity-meta" style={{ marginTop: 6 }}>
                    {line.text}
                  </div>
                </div>
              ))}

              {interimText && (
                <div className="note-card">
                  <div className="coach-label">Listening…</div>
                  <div className="activity-meta" style={{ marginTop: 6 }}>
                    {interimText}
                  </div>
                </div>
              )}
            </div>

            <div className="section-spacing">
              <div className="panel-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Languages size={18} />
                Translated View
              </div>

              <div className="coach-card" style={{ marginTop: 12 }}>
                <div className="coach-label">
                  {targetLanguage === "original" ? "Original Transcript" : "Translator Output"}
                </div>
                <div className="carrier-meta" style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {isTranslating
                    ? "Translating..."
                    : translatedText || "Translated transcript will appear here."}
                </div>
              </div>
            </div>

            <div className="section-spacing">
              <div className="panel-title">Voice Assistant Module</div>

              <div className="activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <Headphones size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Mic + Transcript Connected</div>
                    <div className="activity-meta">
                      Translation panel is ready for a backend route at <code>/api/translate</code>.
                    </div>
                  </div>
                </div>
              </div>

              <div className="activity-item" style={{ marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="stat-icon" style={{ width: 42, height: 42 }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="pipeline-name">Full Transcript Export</div>
                    <div className="activity-meta" style={{ whiteSpace: "pre-wrap" }}>
                      {fullTranscript || "No transcript yet."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}