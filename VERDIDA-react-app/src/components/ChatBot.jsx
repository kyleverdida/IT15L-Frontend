import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { mockChatbotResponses } from '../api/mockData';

const getResponse = (msg) => {
  const lower = msg.toLowerCase();
  if (lower.includes('enroll')) return mockChatbotResponses.enrollment;
  if (lower.includes('course')) return mockChatbotResponses.courses;
  return mockChatbotResponses.default;
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: mockChatbotResponses.greeting },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: getResponse(userMsg) }]);
    }, 500);
  };

  return (
    <>
      {open ? (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 chatbot-popup">
          <div className="bg-gradient-to-r from-red-800 to-red-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare size={20} />
              <span className="font-semibold">EduBot Helper</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
              <X size={20} />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm
                    ${m.role === 'user' ? 'bg-red-800 text-white rounded-br-md' : 'bg-slate-100 text-slate-700 rounded-bl-md'}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about enrollment, courses..."
              className="flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/50"
            />
            <button
              type="submit"
              className="p-2 bg-red-800 text-white rounded-xl hover:bg-red-900 transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-red-800 to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </>
  );
}
