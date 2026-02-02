import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "http://localhost:5000";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function Messages() {
  const myId = Number(localStorage.getItem("userId")) || 0;
  const myName = localStorage.getItem("userName") || "You";

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);

  const [searchEmail, setSearchEmail] = useState("");
  const [draft, setDraft] = useState("");

  const bottomRef = useRef(null);

  const selectedOtherName = useMemo(() => {
    if (!activeConv) return "";
    return activeConv.other_name || activeConv.other_email || "User";
  }, [activeConv]);

  const loadConversations = async () => {
    const res = await fetch(`${API_BASE}/api/messages/conversations`, {
      headers: authHeaders(),
    });
    const data = await res.json();
    if (data.success) setConversations(data.data || []);
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);

    const res = await fetch(
      `${API_BASE}/api/messages/conversations/${conv.id}/messages`,
      { headers: authHeaders() }
    );
    const data = await res.json();
    if (data.success) setMessages(data.data || []);
  };

  const startConversation = async () => {
    const email = searchEmail.trim();
    if (!email) return;

    const res = await fetch(`${API_BASE}/api/messages/conversations/start`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!data.success) return alert(data.message);

    await loadConversations();

    const convId = data.data.conversation_id;
    await openConversation({
      id: convId,
      other_name: data.data.other?.username || data.data.other?.name,
      other_email: data.data.other?.email,
      other_image: data.data.other?.image_path,
      other_role: data.data.other?.role,
    });

    setSearchEmail("");
  };

  const sendMessage = async () => {
    if (!activeConv) return;

    const body = draft.trim();
    if (!body) return;

    const res = await fetch(
      `${API_BASE}/api/messages/conversations/${activeConv.id}/messages`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ body }),
      }
    );

    const data = await res.json();
    if (!data.success) return alert(data.message);

    setDraft("");
    await openConversation(activeConv);
    await loadConversations();
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    // auto-scroll when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.page}>
      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>Inbox</div>
          <div style={styles.sidebarSubtitle}>
            Messages between students & instructors
          </div>
        </div>

        <div style={styles.startRow}>
          <input
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Search by email (teacher/student)"
            style={styles.searchInput}
          />
          <button onClick={startConversation} style={styles.startBtn}>
            Start
          </button>
        </div>

        <div style={styles.convList}>
          {conversations.length === 0 ? (
            <div style={styles.emptyText}>No conversations yet.</div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => openConversation(c)}
                style={{
                  ...styles.convCard,
                  border:
                    activeConv?.id === c.id
                      ? "2px solid #f48c06"
                      : "1px solid #e5e7eb",
                }}
              >
                <div style={styles.convTopRow}>
                  <div style={styles.convName}>
                    {c.other_name || c.other_email}
                  </div>
                  <div style={styles.rolePill}>{c.other_role}</div>
                </div>

                <div style={styles.convLastMsg}>
                  {c.last_message || "No messages yet"}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT CHAT */}
      <div style={styles.chat}>
        {!activeConv ? (
          <div style={styles.noChat}>
            <div style={styles.noChatTitle}>Select a chat</div>
            <div style={styles.noChatSub}>
              Click a conversation from the left, or start one by email.
            </div>
          </div>
        ) : (
          <>
            <div style={styles.chatHeader}>
              <div>
                <div style={styles.chatTitle}>Chat with {selectedOtherName}</div>
                <div style={styles.chatSub}>
                  You are chatting as <b>{myName}</b>
                </div>
              </div>
            </div>

            <div style={styles.messagesArea}>
              {messages.length === 0 ? (
                <div style={styles.emptyText}>No messages yet. Say hi 👋</div>
              ) : (
                messages.map((m) => {
                  const isMine = Number(m.sender_id) === myId;

                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        justifyContent: isMine ? "flex-end" : "flex-start",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          ...styles.bubble,
                          background: isMine ? "#0d2a5a" : "#ffffff",
                          color: isMine ? "#ffffff" : "#111827",
                          border: isMine
                            ? "1px solid rgba(13,42,90,0.2)"
                            : "1px solid #e5e7eb",
                          borderTopLeftRadius: isMine ? 16 : 6,
                          borderTopRightRadius: isMine ? 6 : 16,
                        }}
                      >
                        <div style={styles.bubbleMeta}>
                          <b style={{ fontSize: 12 }}>
                            {isMine ? "You" : (m.sender_username || "User")}
                          </b>
                          <span style={styles.time}>
                            {m.created_at
                              ? new Date(m.created_at).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <div style={styles.bubbleText}>{m.body}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            <div style={styles.composer}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                style={styles.composerInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button onClick={sendMessage} style={styles.sendBtn}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 26,
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: 20,
    maxWidth: 1200,
    margin: "0 auto",
  },
  sidebar: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fff",
    overflow: "hidden",
  },
  sidebarHeader: { padding: 16, borderBottom: "1px solid #eef2f7" },
  sidebarTitle: { fontSize: 18, fontWeight: 900, color: "#0d2a5a" },
  sidebarSubtitle: { fontSize: 12, color: "#6b7280", marginTop: 4 },

  startRow: { padding: 14, display: "flex", gap: 10, borderBottom: "1px solid #eef2f7" },
  searchInput: { flex: 1, padding: 10, borderRadius: 12, border: "1px solid #d1d5db", outline: "none" },
  startBtn: { padding: "10px 14px", borderRadius: 12, border: "none", background: "#0d2a5a", color: "#fff", fontWeight: 800, cursor: "pointer" },

  convList: { padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  convCard: { textAlign: "left", padding: 12, borderRadius: 14, background: "#fff", cursor: "pointer" },
  convTopRow: { display: "flex", alignItems: "center", gap: 10 },
  convName: { fontWeight: 900, color: "#0d2a5a", flex: 1 },
  rolePill: { fontSize: 12, padding: "4px 8px", borderRadius: 999, background: "#fef3c7", color: "#92400e", fontWeight: 800, textTransform: "capitalize" },
  convLastMsg: { fontSize: 12, color: "#6b7280", marginTop: 6 },

  chat: { border: "1px solid #e5e7eb", borderRadius: 16, background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 520 },
  chatHeader: { padding: 16, borderBottom: "1px solid #eef2f7", display: "flex", alignItems: "center", justifyContent: "space-between" },
  chatTitle: { fontSize: 18, fontWeight: 900, color: "#0d2a5a" },
  chatSub: { fontSize: 12, color: "#6b7280", marginTop: 4 },

  messagesArea: { flex: 1, padding: 16, overflowY: "auto", background: "#f9fafb" },

  bubble: { maxWidth: "72%", borderRadius: 16, padding: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" },
  bubbleMeta: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6, opacity: 0.95 },
  time: { fontSize: 11, opacity: 0.8 },
  bubbleText: { fontSize: 14, lineHeight: 1.4 },

  composer: { padding: 14, borderTop: "1px solid #eef2f7", display: "flex", gap: 10, alignItems: "center" },
  composerInput: { flex: 1, padding: 12, borderRadius: 12, border: "1px solid #d1d5db", outline: "none" },
  sendBtn: { padding: "12px 16px", borderRadius: 12, border: "none", background: "#f48c06", color: "#fff", fontWeight: 900, cursor: "pointer" },

  emptyText: { fontSize: 13, color: "#6b7280", padding: 8 },
  noChat: { padding: 30, textAlign: "center", color: "#6b7280", margin: "auto" },
  noChatTitle: { fontSize: 20, fontWeight: 900, color: "#0d2a5a" },
  noChatSub: { marginTop: 8, fontSize: 13 },
};
