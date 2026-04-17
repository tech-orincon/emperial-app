import React from 'react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { CheckoutFormData } from '../hooks/useCheckout';

interface CharacterDetailsFormProps {
  formData: CheckoutFormData;
  onUpdate: (field: string, value: string) => void;
}

export function CharacterDetailsForm({ formData, onUpdate }: CharacterDetailsFormProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-emperial-500/20 flex items-center justify-center text-emperial-400 font-bold">
          1
        </div>
        <h2 className="text-xl font-bold text-white">Character Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Character Name</label>
          <input
            type="text"
            value={formData.characterName}
            onChange={(e) => onUpdate('characterName', e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500"
            placeholder="e.g. Arthas"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Realm</label>
          <select
            value={formData.realm}
            onChange={(e) => onUpdate('realm', e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
            <option value="">Select Realm</option>
            <option value="illidan">Illidan (US)</option>
            <option value="stormrage">Stormrage (US)</option>
            <option value="area52">Area 52 (US)</option>
            <option value="kazzak">Kazzak (EU)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Region</label>
          <select
            value={formData.region}
            onChange={(e) => onUpdate('region', e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500">
            <option>North America (US)</option>
            <option>Europe (EU)</option>
            <option>Asia (KR/TW)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Faction</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="faction"
                value="horde"
                checked={formData.faction === 'horde'}
                onChange={(e) => onUpdate('faction', e.target.value)}
                className="text-emperial-500 focus:ring-emperial-500 bg-slate-800"
              />
              <span className="text-slate-300">Horde</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="faction"
                value="alliance"
                checked={formData.faction === 'alliance'}
                onChange={(e) => onUpdate('faction', e.target.value)}
                className="text-emperial-500 focus:ring-emperial-500 bg-slate-800"
              />
              <span className="text-slate-300">Alliance</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Preferred Schedule / Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => onUpdate('notes', e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emperial-500 h-24"
          placeholder="When are you available? Any specific requests?"
        />
      </div>
    </GlassCard>
  );
}
