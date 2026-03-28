import React, { useState } from "react";
import {
  PageHeader,
  Panel,
  MetricCard,
  SectionTitle,
  ActionButton,
  Badge,
} from "../components/crm/FuturisticUI.jsx";

const calls = [
  { name: "Maria Gonzalez", number: "(312) 555-0182", result: "No Answer" },
  { name: "James Robinson", number: "(773) 555-0127", result: "Connected" },
  { name: "Angela Turner", number: "(708) 555-0191", result: "Voicemail" },
  { name: "Chris Lewis", number: "(847) 555-0176", result: "Connected" },
];

export default function DialerPage() {
  const [number, setNumber] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        section="Tools"
        title="Dialer"
        subtitle="A premium outbound call workspace, ready to be demoed without real telephony yet."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Calls Today" value="63" note="Current activity" tone="purple" />
        <MetricCard label="Connect Rate" value="31%" note="Conversation efficiency" tone="green" />
        <MetricCard label="Booked from Calls" value="6" note="Dialer performance" tone="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel>
          <SectionTitle
            eyebrow="Manual Dial"
            title="Call Control"
            subtitle="High-end dialer layout without live integration yet."
          />

          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter phone number..."
            className="crm-input text-lg"
          />

          <div className="mt-5 grid grid-cols-3 gap-3">
            {["1","2","3","4","5","6","7","8","9","*","0","#"].map((n) => (
              <button
                key={n}
                onClick={() => setNumber((prev) => prev + n)}
                className="crm-hover-lift rounded-2xl border border-white/10 bg-white/5 py-4 text-lg font-bold text-white hover:bg-white/10"
              >
                {n}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton tone="green">Call Now</ActionButton>
            <ActionButton tone="purple">Save Number</ActionButton>
            <ActionButton tone="ghost">Clear</ActionButton>
          </div>
        </Panel>

        <Panel>
          <SectionTitle
            eyebrow="Recent Calls"
            title="Call History"
            subtitle="Recent dial results and outcomes."
          />

          <div className="space-y-3">
            {calls.map((call) => (
              <div
                key={`${call.name}-${call.number}`}
                className="crm-hover-lift flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div>
                  <div className="font-black text-white">{call.name}</div>
                  <div className="text-sm text-zinc-400">{call.number}</div>
                </div>

                <Badge tone={call.result === "Connected" ? "green" : "purple"}>
                  {call.result}
                </Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}