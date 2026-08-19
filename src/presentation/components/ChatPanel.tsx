import React, { useEffect, useRef, useState } from 'react';
import { suscribirChat, enviarMensaje } from '../../infrastructure/chatRepository';
import type { MensajeChat, UsuarioDB } from '../../domain/types';
import { COLORS } from '../../constants/theme';
import { webStyles } from '../styles/webStyles';

export const ChatPanel: React.FC<{ dbUser: UsuarioDB; onClose: () => void }> = ({ dbUser, onClose }) => {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [texto, setTexto] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = suscribirChat(setMensajes);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [mensajes]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    await enviarMensaje(dbUser.nombre, dbUser.rol, texto);
    setTexto('');
  };

  return (
    <div style={webStyles.chatPanel} className="bk-modal-enter">
      <div style={webStyles.chatHeader}>
        <span>💬 Comunicación Interna</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
      </div>
      <div style={webStyles.chatBody} ref={scrollRef}>
        {mensajes.map((m) => {
          const isMe = m.autor === dbUser.nombre;
          return (
            <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', ...webStyles.chatMsg, backgroundColor: isMe ? COLORS.vainilla : COLORS.blanco, border: `1px solid ${COLORS.vainilla}` }}>
              {!isMe && <div style={{ fontSize: '10px', color: COLORS.moca, fontWeight: 'bold', marginBottom: '2px' }}>{m.autor} ({m.rol})</div>}
              <div style={{ color: COLORS.chocolate }}>{m.texto}</div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSend} style={webStyles.chatInputRow}>
        <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe un mensaje..." style={{ ...webStyles.input, padding: '8px', marginBottom: 0 }} />
        <button type="submit" style={{ ...webStyles.primaryBtn, padding: '8px 12px', marginLeft: '8px' }}>➤</button>
      </form>
    </div>
  );
};