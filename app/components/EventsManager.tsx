'use client';

import { useState } from 'react';
import { LifeEvent, EventCategory, EventPreset } from '@/app/types';

const EVENT_PRESETS: EventPreset[] = [
  { category: 'migration', emoji: '✈️', defaultColor: '#06b6d4', label: 'Migracion' },
  { category: 'family', emoji: '👶', defaultColor: '#ec4899', label: 'Nacimiento hijo' },
  { category: 'family', emoji: '💍', defaultColor: '#f472b6', label: 'Matrimonio' },
  { category: 'career', emoji: '💼', defaultColor: '#f59e0b', label: 'Nuevo trabajo' },
  { category: 'education', emoji: '🎓', defaultColor: '#8b5cf6', label: 'Graduacion' },
  { category: 'health', emoji: '🏥', defaultColor: '#ef4444', label: 'Salud' },
  { category: 'milestone', emoji: '🌟', defaultColor: '#10b981', label: 'Hito personal' },
  { category: 'custom', emoji: '📌', defaultColor: '#6366f1', label: 'Personalizado' },
];

interface EventsManagerProps {
  events: LifeEvent[];
  onChange: (events: LifeEvent[]) => void;
  birthDate: Date | null;
}

interface EventFormData {
  name: string;
  date: string;
  category: EventCategory;
  emoji: string;
  color: string;
  description: string;
}

const defaultFormData: EventFormData = {
  name: '',
  date: '',
  category: 'milestone',
  emoji: '🌟',
  color: '#10b981',
  description: '',
};

export default function EventsManager({ events, onChange, birthDate }: EventsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);

  const openNewEventModal = (preset?: EventPreset) => {
    setEditingEvent(null);
    setFormData({
      ...defaultFormData,
      category: preset?.category || 'milestone',
      emoji: preset?.emoji || '🌟',
      color: preset?.defaultColor || '#10b981',
    });
    setIsModalOpen(true);
  };

  const openEditEventModal = (event: LifeEvent) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date.toISOString().split('T')[0],
      category: event.category,
      emoji: event.emoji,
      color: event.color || '#10b981',
      description: event.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.date) return;

    const eventData: LifeEvent = {
      id: editingEvent?.id || crypto.randomUUID(),
      name: formData.name,
      date: new Date(formData.date),
      category: formData.category,
      emoji: formData.emoji,
      color: formData.color,
      description: formData.description || undefined,
    };

    if (editingEvent) {
      onChange(events.map((e) => (e.id === editingEvent.id ? eventData : e)));
    } else {
      onChange([...events, eventData]);
    }

    setIsModalOpen(false);
    setFormData(defaultFormData);
  };

  const handleDelete = (eventId: string) => {
    onChange(events.filter((e) => e.id !== eventId));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {EVENT_PRESETS.slice(0, 4).map((preset) => (
          <button
            key={preset.category + preset.emoji}
            onClick={() => openNewEventModal(preset)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg
                       bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700
                       transition-colors"
          >
            <span>{preset.emoji}</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Events list */}
      {events.length > 0 && (
        <div className="space-y-2">
          {events
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg
                         bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: event.color + '20' }}
                  >
                    {event.emoji}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{event.name}</p>
                    <p className="text-xs text-zinc-500">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditEventModal(event)}
                    className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                             text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add button */}
      <button
        onClick={() => openNewEventModal()}
        className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700
                   rounded-lg text-zinc-500 hover:border-[#ff5252] hover:text-[#ff5252]
                   transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Agregar evento de vida
      </button>

      {/* Empty state */}
      {events.length === 0 && (
        <p className="text-center text-sm text-zinc-500 py-4">
          No hay eventos registrados. Agrega fechas importantes de tu vida.
        </p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-foreground">
                {editingEvent ? 'Editar evento' : 'Nuevo evento'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Nombre del evento
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Migracion a Argentina"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                           bg-white dark:bg-zinc-800 text-foreground
                           focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  min={birthDate?.toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                           bg-white dark:bg-zinc-800 text-foreground
                           focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                />
              </div>

              {/* Emoji & Color */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Emoji
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {EVENT_PRESETS.map((preset) => (
                      <button
                        key={preset.emoji}
                        onClick={() => setFormData({ ...formData, emoji: preset.emoji })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center
                                  transition-colors ${
                                    formData.emoji === preset.emoji
                                      ? 'bg-[#ff5252]/20 ring-2 ring-[#ff5252]'
                                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                  }`}
                      >
                        {preset.emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Descripcion (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Agrega una nota sobre este evento..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                           bg-white dark:bg-zinc-800 text-foreground resize-none
                           focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-zinc-200 dark:bg-zinc-700
                         text-foreground hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.date}
                className="flex-1 py-2 px-4 rounded-lg bg-[#ff5252] text-white
                         hover:bg-[#ff3333] disabled:opacity-50 transition-colors"
              >
                {editingEvent ? 'Guardar' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
