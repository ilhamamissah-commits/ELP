import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Volume2, User, Info, Check, Sun, Moon,
  Eye, Trash2, Save, RotateCcw, Baby, Type as TextIcon,
  Music, Vibrate, Play
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import { BackButton } from '../core/BackButton';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const {
    theme, textSize, soundEnabled, musicEnabled, reduceMotion,
    setTheme, setTextSize, toggleSound, toggleMusic,
    toggleReduceMotion, resetSettings, voiceAccent, setVoiceAccent, autoReadEnabled, toggleAutoRead,
  } = useSettingsStore();

  const { profiles, currentProfileId, removeProfile } = useProfileStore();
  const { setActiveProfile } = useProgressStore();

  const currentProfile = currentProfileId ? profiles[currentProfileId] : undefined;
  const [editName, setEditName] = useState(currentProfile?.name || '');
  const [editAge, setEditAge] = useState(currentProfile?.age || 3);
  const [editAvatar, setEditAvatar] = useState(currentProfile?.avatar || '🐣');
  const [saved, setSaved] = useState(false);

  const AVATARS = ['🐣', '🦊', '🦉', '🐯', '🐨', '🦁', '🐼', '🐰', '🦄', '🐧', '🐸', '🐢'];

  const handleSaveProfile = async () => {
    if (!currentProfileId) return;
    // Update via Zustand addProfile (overwrite behavior)
    useProfileStore.getState().addProfile(currentProfileId, editName, editAge, editAvatar);
    await setActiveProfile(currentProfileId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteProfile = () => {
    if (!currentProfileId) return;
    if (confirm(`Are you sure you want to delete ${currentProfile?.name}? This cannot be undone.`)) {
      removeProfile(currentProfileId);
      onBack();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <BackButton onClick={onBack} label="Back" />

      <h2 className="text-3xl font-bold text-white mb-6 text-center">⚙️ Settings</h2>

      {/* ---------- APPEARANCE ---------- */}
      <Section title="Appearance" icon={<Palette className="w-5 h-5" />}>
        <Label>Theme</Label>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <ThemeButton active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun />} label="Light" />
          <ThemeButton active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon />} label="Dark" />
          <ThemeButton active={theme === 'high-contrast'} onClick={() => setTheme('high-contrast')} icon={<Eye />} label="Contrast" />
        </div>

        <Label>Text Size</Label>
        <div className="grid grid-cols-3 gap-3">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setTextSize(size)}
              className={`p-3 rounded-xl border-2 transition text-white font-bold capitalize ${
                textSize === size ? 'bg-indigo-600 border-indigo-400' : 'bg-gray-800 border-gray-700 hover:border-indigo-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      {/* ---------- AUDIO ---------- */}
      <Section title="Audio & Motion" icon={<Volume2 className="w-5 h-5" />}>
  <ToggleRow
    icon={<Volume2 className="w-4 h-4" />}
    label="Sound Effects"
    description="Play sounds when your child taps buttons"
    enabled={soundEnabled}
    onToggle={toggleSound}
  />
  <ToggleRow
    icon={<Music className="w-4 h-4" />}
    label="Background Music"
    description="Play calm music while learning"
    enabled={musicEnabled}
    onToggle={toggleMusic}
  />
  <ToggleRow
    icon={<Play className="w-4 h-4" />}
    label="Auto-Read Lessons"
    description="Automatically read lesson titles and instructions aloud"
    enabled={autoReadEnabled}
    onToggle={toggleAutoRead}
  />
  <ToggleRow
    icon={<Vibrate className="w-4 h-4" />}
    label="Reduce Motion"
    description="Reduce animations for children who are sensitive"
    enabled={reduceMotion}
    onToggle={toggleReduceMotion}
  />

  <div className="mt-5">
    <Label>Voice Accent</Label>
    <div className="grid grid-cols-2 gap-2 mt-2">
      {([
        { id: 'auto', label: '🌍 Auto (Device)' },
        { id: 'en-US', label: '🇺🇸 American' },
        { id: 'en-GB', label: '🇬🇧 British' },
        { id: 'en-AU', label: '🇦🇺 Australian' },
        { id: 'en-IN', label: '🇮🇳 Indian' },
      ] as const).map((opt) => (
        <button
          key={opt.id}
          onClick={() => setVoiceAccent(opt.id)}
          className={`p-3 rounded-xl border-2 text-sm font-bold transition ${
            voiceAccent === opt.id
              ? 'bg-indigo-600 border-indigo-400 text-white'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>

    <button
      onClick={() => {
        // Test the currently selected voice
        const test = new SpeechSynthesisUtterance('Hello! This is your selected voice.');
        const voices = window.speechSynthesis.getVoices();
        const match =
          voiceAccent === 'auto'
            ? voices.find((v) => v.lang === navigator.language)
              || voices.find((v) => v.lang.startsWith('en'))
            : voices.find((v) => v.lang === voiceAccent)
              || voices.find((v) => v.lang.startsWith('en'));
        if (match) test.voice = match;
        test.rate = 0.85;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(test);
      }}
      className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold flex items-center justify-center gap-2"
    >
      🔊 Test Voice
    </button>
  </div>
</Section>

      {/* ---------- PROFILE ---------- */}
      <Section title="Edit Profile" icon={<User className="w-5 h-5" />}>
        {!currentProfile ? (
          <p className="text-gray-400 text-sm">No active profile.</p>
        ) : (
          <>
            <Label>Name</Label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-4 outline-none focus:border-indigo-500"
              placeholder="Child's name"
            />

            <Label>Age</Label>
            <input
              type="number"
              min={2}
              max={10}
              value={editAge}
              onChange={(e) => setEditAge(Number(e.target.value))}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white mb-4 outline-none focus:border-indigo-500"
            />

            <Label>Avatar</Label>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setEditAvatar(emoji)}
                  className={`aspect-square rounded-xl text-2xl flex items-center justify-center border-2 transition ${
                    editAvatar === emoji ? 'bg-indigo-600/30 border-indigo-400' : 'bg-gray-800 border-gray-700 hover:border-indigo-400'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center justify-center gap-2"
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>

              <button
                onClick={handleDeleteProfile}
                className="py-3 px-4 bg-red-600/20 hover:bg-red-600/30 rounded-xl text-red-400 font-bold border border-red-500/30 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </>
        )}
      </Section>

      {/* ---------- ABOUT ---------- */}
      <Section title="About" icon={<Info className="w-5 h-5" />}>
        <div className="flex items-center gap-3 mb-3">
          <Baby className="w-5 h-5 text-indigo-300" />
          <div>
            <p className="text-white font-bold">Early Learning Engine</p>
            <p className="text-xs text-gray-400">Version 1.0.0</p>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          A Montessori + Cambridge learning journey for children aged 2–10.
        </p>

        <button
          onClick={resetSettings}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 font-bold flex items-center justify-center gap-2 border border-gray-700"
        >
          <RotateCcw className="w-4 h-4" /> Reset All Settings
        </button>
      </Section>
    </div>
  );
};

/* ---------- Helper Components ---------- */
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-app-card border border-app-border rounded-2xl p-5 mb-5">
    <div className="flex items-center gap-2 mb-4 text-white">
      <span className="text-indigo-400">{icon}</span>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">{children}</p>
);

const ThemeButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${
      active ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-indigo-400'
    }`}
  >
    {icon}
    <span className="text-sm font-bold">{label}</span>
  </button>
);

const ToggleRow: React.FC<{ icon: React.ReactNode; label: string; description: string; enabled: boolean; onToggle: () => void }> = ({ icon, label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between gap-3 py-3 border-b border-app-border last:border-0">
    <div className="flex items-center gap-3">
      <span className="text-indigo-400">{icon}</span>
      <div>
        <p className="text-white font-bold text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition ${enabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
      />
    </button>
  </div>
);