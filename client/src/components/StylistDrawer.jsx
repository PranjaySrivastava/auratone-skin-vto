import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { API_BASE } from '../config';
import { X, Sparkles, Send, Bot, User, CheckCircle2 } from 'lucide-react';

export default function StylistDrawer() {
  const { 
    isStylistDrawerOpen, 
    toggleStylistDrawer, 
    skinAnalysis, 
    activeBundle,
    chatMessages,
    addChatMessage 
  } = useStore();

  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isStylistDrawerOpen) return null;

  const quickQuestions = [
    'Why does this color suit my undertone?',
    'What jewelry metals match my skin?',
    'How does the lipstick balance this outfit?'
  ];

  const handleSend = async (qText) => {
    const question = qText || inputQuestion;
    if (!question.trim()) return;

    // Add user message
    addChatMessage({ sender: 'user', text: question });
    setInputQuestion('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/stylist/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          skinProfile: skinAnalysis,
          currentBundle: activeBundle
        })
      });
      const data = await res.json();
      if (data.success) {
        addChatMessage({ sender: 'stylist', text: data.answer });
      }
    } catch (err) {
      addChatMessage({ 
        sender: 'stylist', 
        text: 'This look has been curated based on the optical reflection of your melanin undertone, ensuring optimal contrast balance.' 
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel-elevated" style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        borderRadius: '24px 0 0 24px',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--border-glass-hover)',
        animation: 'slideIn 0.3s var(--ease-spring)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6, #d4af37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>AuraTone Stylist Copilot</div>
              <div style={{ fontSize: '0.7rem', color: '#c4b5fd' }}>Agentic Color Theory Reasoning</div>
            </div>
          </div>
          <button 
            onClick={toggleStylistDrawer}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Look Harmony Explainer Badge */}
        {activeBundle && (
          <div style={{
            padding: '16px 24px',
            background: 'rgba(212, 175, 55, 0.05)',
            borderBottom: '1px solid var(--border-glass)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f3e5ab', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10b981" />
              Active Analysis: {activeBundle.title}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeBundle.stylistRationale}
            </p>
          </div>
        )}

        {/* Chat History Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {msg.sender === 'stylist' && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={14} color="#a78bfa" />
                </div>
              )}
              <div style={{
                background: msg.sender === 'user' ? 'linear-gradient(135deg, #d4af37, #b89728)' : 'rgba(255, 255, 255, 0.05)',
                color: msg.sender === 'user' ? '#090a0f' : 'var(--text-primary)',
                fontWeight: msg.sender === 'user' ? 600 : 400,
                padding: '10px 16px',
                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-glass)'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#a78bfa', fontSize: '0.8rem' }}>
              <Sparkles size={14} className="animate-spin" />
              <span>Synthesizing color science...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Suggested inquiries:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <input 
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask why this outfit or shade harmonizes..."
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: '9999px',
              padding: '10px 16px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => handleSend()}
            className="btn-primary"
            style={{ padding: '10px 14px', borderRadius: '50%' }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
