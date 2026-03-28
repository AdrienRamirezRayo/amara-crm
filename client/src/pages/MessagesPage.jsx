import React, { useState } from "react";
import {
  PageHeader,
  Panel,
  SectionTitle,
  ActionButton,
} from "../components/crm/FuturisticUI.jsx";

const messages = [
  { name: "Maria Gonzalez", preview: "Yes tomorrow at 10:30 works for me.", time: "9:14 AM" },
  { name: "James Robinson", preview: "Can we move the appointment to Friday?", time: "11:02 AM" },
  { name: "Angela Turner", preview: "I sent over the policy questions.", time: "1:36 PM" },
  { name: "Chris Lewis", preview: "Please call me after 6.", time: "4:48 PM" },
];

export default function MessagesPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        section="Tools"
        title="Messages"
        subtitle="A futuristic communication workspace for follow-ups and client threads."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
        <Panel>
          <SectionTitle
            eyebrow="Inbox"
            title="Conversations"
            subtitle="Fast access to current threads."
          />

          <input className="crm-input mb-4" placeholder="Search conversations..." />

          <div className="space-y-3">
            {messages.map((messageItem) => (
              <div
                key={`${messageItem.name}-${messageItem.time}`}
                className="crm-hover-lift rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="font-black text-white">{messageItem.name}</div>
                  <div className="text-xs text-zinc-500">{messageItem.time}</div>
                </div>
                <div className="mt-2 text-sm text-zinc-400">{messageItem.preview}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle
            eyebrow="Thread"
            title="Conversation View"
            subtitle="Message detail area with a cleaner, more productized layout."
          />

          <div className="space-y-4">
            <div className="max-w-[80%] rounded-2xl bg-black/20 p-4 text-zinc-300">
              Hi Maria, just confirming our appointment for tomorrow at 10:30 AM.
            </div>

            <div className="ml-auto max-w-[80%] rounded-2xl bg-violet-600/20 p-4 text-white">
              Yes tomorrow at 10:30 works for me.
            </div>

            <div className="max-w-[80%] rounded-2xl bg-black/20 p-4 text-zinc-300">
              Perfect. I’ll send the reminder shortly.
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
              className="crm-input flex-1"
            />
            <ActionButton tone="purple">Send</ActionButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}