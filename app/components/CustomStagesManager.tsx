'use client';

import { useState } from 'react';
import { CustomStage } from '@/app/types';

const SUGGESTED_COLORS = [
  { color: '#f472b6', colorFuture: '#fce7f3', name: 'Rosa' },
  { color: '#a78bfa', colorFuture: '#ede9fe', name: 'Violeta' },
  { color: '#60a5fa', colorFuture: '#dbeafe', name: 'Azul' },
  { color: '#34d399', colorFuture: '#d1fae5', name: 'Verde' },
  { color: '#fbbf24', colorFuture: '#fef3c7', name: 'Amarillo' },
  { color: '#f87171', colorFuture: '#fee2e2', name: 'Coral' },
];

interface CustomStagesManagerProps {
  stages: CustomStage[];
  onChange: (stages: CustomStage[]) => void;
}

interface StageFormData {
  name: string;
  color: string;
  colorFuture: string;
  startAge: string;
  endAge: string;
  startDate: string;
  endDate: string;
  canOverlap: boolean;
  icon: string;
  useAge: boolean;
}

const defaultFormData: StageFormData = {
  name: '',
  color: '#ec4899',
  colorFuture: '#fce7f3',
  startAge: '',
  endAge: '',
  startDate: '',
  endDate: '',
  canOverlap: true,
  icon: '👶',
  useAge: true,
};

const STAGE_ICONS = ['👶', '👨‍👩‍👧', '🏠', '🎯', '💪', '🧘', '📚', '🎨', '🌱', '⭐'];

export default function CustomStagesManager({ stages, onChange }: CustomStagesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<CustomStage | null>(null);
  const [formData, setFormData] = useState<StageFormData>(defaultFormData);

  const addParenthoodStage = () => {
    const exists = stages.some((s) => s.name.toLowerCase().includes('paternidad'));
    if (exists) return;

    setEditingStage(null);
    setFormData({
      ...defaultFormData,
      name: 'Paternidad/Maternidad',
      color: '#ec4899',
      colorFuture: '#fce7f3',
      icon: '👶',
      useAge: false,
    });
    setIsModalOpen(true);
  };

  const openNewStageModal = () => {
    setEditingStage(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditStageModal = (stage: CustomStage) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      color: stage.color,
      colorFuture: stage.colorFuture,
      startAge: stage.startAge?.toString() || '',
      endAge: stage.endAge?.toString() || '',
      startDate: stage.startDate?.toISOString().split('T')[0] || '',
      endDate: stage.endDate?.toISOString().split('T')[0] || '',
      canOverlap: stage.canOverlap,
      icon: stage.icon,
      useAge: stage.startAge !== undefined,
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const stageData: CustomStage = {
      id: editingStage?.id || crypto.randomUUID(),
      name: formData.name,
      color: formData.color,
      colorFuture: formData.colorFuture,
      canOverlap: formData.canOverlap,
      icon: formData.icon,
      ...(formData.useAge
        ? {
            startAge: formData.startAge ? parseInt(formData.startAge) : undefined,
            endAge: formData.endAge ? parseInt(formData.endAge) : undefined,
          }
        : {
            startDate: formData.startDate ? new Date(formData.startDate) : undefined,
            endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          }),
    };

    if (editingStage) {
      onChange(stages.map((s) => (s.id === editingStage.id ? stageData : s)));
    } else {
      onChange([...stages, stageData]);
    }

    setIsModalOpen(false);
    setFormData(defaultFormData);
  };

  const handleDelete = (stageId: string) => {
    onChange(stages.filter((s) => s.id !== stageId));
  };

  const handleColorSelect = (color: string, colorFuture: string) => {
    setFormData({ ...formData, color, colorFuture });
  };

  return (
    <div className="space-y-4">
      {/* Quick add parenthood */}
      {!stages.some((s) => s.name.toLowerCase().includes('paternidad')) && (
        <button
          onClick={addParenthoodStage}
          className="flex items-center gap-2 px-4 py-2 w-full justify-center
                     bg-pink-100 dark:bg-pink-900/30 rounded-lg
                     text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50
                     transition-colors"
        >
          <span>👶</span>
          <span>Agregar etapa Paternidad/Maternidad</span>
        </button>
      )}

      {/* Stages list */}
      {stages.length > 0 && (
        <div className="space-y-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="flex items-center justify-between p-3 rounded-lg
                       bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: stage.color + '30' }}
                >
                  {stage.icon}
                </span>
                <div>
                  <p className="font-medium text-foreground">{stage.name}</p>
                  <p className="text-xs text-zinc-500">
                    {stage.startAge !== undefined
                      ? `${stage.startAge} - ${stage.endAge || '∞'} anos`
                      : stage.startDate
                        ? `Desde ${stage.startDate.toLocaleDateString('es')}`
                        : 'Sin rango definido'}
                  </p>
                </div>
                <div
                  className="w-4 h-4 rounded-full ml-2"
                  style={{ backgroundColor: stage.color }}
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditStageModal(stage)}
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
                  onClick={() => handleDelete(stage.id)}
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
        onClick={openNewStageModal}
        className="w-full py-3 border-2 border-dashed border-zinc-300 dark:border-zinc-700
                   rounded-lg text-zinc-500 hover:border-[#ff5252] hover:text-[#ff5252]
                   transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Crear etapa personalizada
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-foreground">
                {editingStage ? 'Editar etapa' : 'Nueva etapa'}
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
                  Nombre de la etapa
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Paternidad"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                           bg-white dark:bg-zinc-800 text-foreground
                           focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Icono
                </label>
                <div className="flex gap-1 flex-wrap">
                  {STAGE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
                                transition-colors ${
                                  formData.icon === icon
                                    ? 'bg-[#ff5252]/20 ring-2 ring-[#ff5252]'
                                    : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {SUGGESTED_COLORS.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => handleColorSelect(c.color, c.colorFuture)}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        formData.color === c.color ? 'ring-2 ring-offset-2 ring-zinc-400 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        color: e.target.value,
                        colorFuture: e.target.value + '40',
                      })
                    }
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Range type toggle */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Definir rango por
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, useAge: true })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                      formData.useAge
                        ? 'bg-[#ff5252] text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Edad
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, useAge: false })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                      !formData.useAge
                        ? 'bg-[#ff5252] text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Fecha
                  </button>
                </div>
              </div>

              {/* Range inputs */}
              {formData.useAge ? (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Desde (anos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.startAge}
                      onChange={(e) => setFormData({ ...formData, startAge: e.target.value })}
                      placeholder="Ej: 25"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                               bg-white dark:bg-zinc-800 text-foreground
                               focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Hasta (anos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.endAge}
                      onChange={(e) => setFormData({ ...formData, endAge: e.target.value })}
                      placeholder="Ej: 45 (vacio = indefinido)"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                               bg-white dark:bg-zinc-800 text-foreground
                               focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                               bg-white dark:bg-zinc-800 text-foreground
                               focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600
                               bg-white dark:bg-zinc-800 text-foreground
                               focus:outline-none focus:ring-2 focus:ring-[#ff5252]"
                    />
                  </div>
                </div>
              )}

              {/* Can overlap */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canOverlap}
                  onChange={(e) => setFormData({ ...formData, canOverlap: e.target.checked })}
                  className="w-5 h-5 rounded accent-[#ff5252]"
                />
                <div>
                  <span className="font-medium text-foreground">Puede sobreponerse</span>
                  <p className="text-xs text-zinc-500">
                    Se mostrara sobre otras etapas (ninez, estudio, trabajo)
                  </p>
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-4 border-t border-zinc-200 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-900">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-zinc-200 dark:bg-zinc-700
                         text-foreground hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="flex-1 py-2 px-4 rounded-lg bg-[#ff5252] text-white
                         hover:bg-[#ff3333] disabled:opacity-50 transition-colors"
              >
                {editingStage ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
