import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Check, X, Calendar } from 'lucide-react';

interface EventParticipantsProps {
  eventId: string;
  participants: Array<{
    memberId: string;
    registrationDate: Date;
    attended: boolean;
  }>;
  onAddParticipant: (eventId: string, memberId: string) => Promise<void>;
  onRemoveParticipant: (eventId: string, memberId: string) => Promise<void>;
  onMarkAttendance: (eventId: string, memberId: string, attended: boolean) => Promise<void>;
  availableMembers?: Array<{ id: string; firstName: string; lastName: string; email: string }>;
  maxParticipants?: number;
}

const EventParticipants: React.FC<EventParticipantsProps> = ({
  eventId,
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onMarkAttendance,
  availableMembers = [],
  maxParticipants
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddParticipant = async () => {
    if (!selectedMemberId) return;
    
    setIsLoading(true);
    try {
      await onAddParticipant(eventId, selectedMemberId);
      setSelectedMemberId('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du participant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveParticipant = async (memberId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer ce participant ?')) return;
    
    setIsLoading(true);
    try {
      await onRemoveParticipant(eventId, memberId);
    } catch (error) {
      console.error('Erreur lors du retrait du participant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAttendance = async (memberId: string, currentAttendance: boolean) => {
    setIsLoading(true);
    try {
      await onMarkAttendance(eventId, memberId, !currentAttendance);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableMembersToAdd = availableMembers.filter(
    member => !participants.some(p => p.memberId === member.id)
  );

  const isMaxCapacityReached = maxParticipants && participants.length >= maxParticipants;
  const attendanceCount = participants.filter(p => p.attended).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Participants ({participants.length}
            {maxParticipants && `/${maxParticipants}`})
          </h3>
        </div>
        
        {!isMaxCapacityReached && availableMembersToAdd.length > 0 && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-violet-600">{participants.length}</div>
          <div className="text-sm text-gray-600">Inscrits</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{attendanceCount}</div>
          <div className="text-sm text-gray-600">Présents</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {participants.length - attendanceCount}
          </div>
          <div className="text-sm text-gray-600">Absents</div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Ajouter un participant</h4>
          <div className="flex gap-3">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Sélectionner un membre...</option>
              {availableMembersToAdd.map(member => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.email})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddParticipant}
              disabled={!selectedMemberId || isLoading}
              className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Alertes */}
      {isMaxCapacityReached && (
        <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
          <p className="text-sm text-orange-800">
            La capacité maximale de l'événement a été atteinte ({maxParticipants} participants).
          </p>
        </div>
      )}

      {/* Liste des participants */}
      {participants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Aucun participant inscrit pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => {
            const member = availableMembers.find(m => m.id === participant.memberId);
            return (
              <div
                key={participant.memberId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-3 h-3 rounded-full ${
                      participant.attended ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {member ? `${member.firstName} ${member.lastName}` : `Membre ${participant.memberId}`}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Inscrit le {new Date(participant.registrationDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Bouton de présence */}
                  <button
                    onClick={() => handleToggleAttendance(participant.memberId, participant.attended)}
                    disabled={isLoading}
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      participant.attended
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    title={participant.attended ? 'Marquer comme absent' : 'Marquer comme présent'}
                  >
                    {participant.attended ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Présent
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Absent
                      </>
                    )}
                  </button>
                  
                  {/* Bouton de suppression */}
                  <button
                    onClick={() => handleRemoveParticipant(participant.memberId)}
                    disabled={isLoading}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                    title="Retirer le participant"
                  >
                    <UserMinus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventParticipants;
