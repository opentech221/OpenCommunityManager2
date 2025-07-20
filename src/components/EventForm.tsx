import React, { useState } from 'react';
import { type EventType } from '../types';

interface EventFormProps {
  event: EventType | null;
  onSave: (event: EventType) => void;
  onCancel: () => void;
}

const defaultEvent: EventType = {
  id: '',
  title: '',
  description: '',
  startDate: new Date(),
  location: '',
  type: 'MEETING',
  status: 'PLANNED',
  maxParticipants: 0,
  associationId: '',
  createdBy: '',
  participants: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

export default function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [form, setForm] = useState<EventType>(event || defaultEvent);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'maxParticipants' ? Number(value) : value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, startDate: new Date(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, updatedAt: new Date() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="event-title" className="block text-sm font-medium mb-1">Titre</label>
        <input
          id="event-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Titre de l'événement"
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="titre"
        />
      </div>
      <div>
        <label htmlFor="event-description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="event-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="Description de l'événement"
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="description"
        />
      </div>
      <div>
        <label htmlFor="event-date" className="block text-sm font-medium mb-1">Date</label>
        <input
          id="event-date"
          type="datetime-local"
          name="startDate"
          value={form.startDate.toISOString().slice(0,16)}
          onChange={handleDateChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="date"
        />
      </div>
      <div>
        <label htmlFor="event-location" className="block text-sm font-medium mb-1">Lieu</label>
        <input
          id="event-location"
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          placeholder="Lieu de l'événement"
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="lieu"
        />
      </div>
      <div>
        <label htmlFor="event-type" className="block text-sm font-medium mb-1">Type</label>
        <select
          id="event-type"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="type"
        >
          <option value="MEETING">Réunion</option>
          <option value="SOCIAL">Social</option>
          <option value="TRAINING">Formation</option>
        </select>
      </div>
      <div>
        <label htmlFor="event-max-participants" className="block text-sm font-medium mb-1">Nombre max. participants</label>
        <input
          id="event-max-participants"
          type="number"
          name="maxParticipants"
          value={form.maxParticipants}
          onChange={handleChange}
          min={0}
          placeholder="Nombre maximum de participants"
          className="w-full px-3 py-2 border rounded-lg"
          aria-label="participants"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" aria-label="Annuler événement" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200">Annuler</button>
        <button
          type="submit"
          aria-label={event ? "Modifier l'événement" : "Ajouter un événement"}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white"
        >
          {event ? "Modifier l'événement" : "Ajouter un événement"}
        </button>
      </div>
    </form>
  );
}
