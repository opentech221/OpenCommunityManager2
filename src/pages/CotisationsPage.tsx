import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PaymentStatus, PaymentMethod, type CotisationType } from '../types';
import { formatCurrency, formatDate } from '../utils';

const mockCotisations: CotisationType[] = [
  {
    id: '1',
    memberId: '1',
    amount: 15000,
    paymentDate: new Date('2024-07-01'),
    paymentMethod: PaymentMethod.CASH,
    status: PaymentStatus.PAID,
    year: 2024,
    notes: 'Cotisation annuelle',
  },
  {
    id: '2',
    memberId: '2',
    amount: 10000,
    paymentDate: new Date('2024-07-10'),
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    status: PaymentStatus.PENDING,
    year: 2024,
    notes: 'En attente',
  },
  {
    id: '3',
    memberId: '3',
    amount: 8000,
    paymentDate: new Date('2024-06-15'),
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    status: PaymentStatus.OVERDUE,
    year: 2024,
    notes: 'Retard',
  },
];

const members = [
  { id: '1', name: 'Aminata Diallo' },
  { id: '2', name: 'Mamadou Ba' },
  { id: '3', name: 'Fatou Camara' },
];

export default function CotisationsPage() {
  const [cotisations, setCotisations] = useState<CotisationType[]>(mockCotisations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<keyof typeof PaymentStatus | 'ALL'>('ALL');
  const [feedback, setFeedback] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCotisation, setEditCotisation] = useState<CotisationType | null>(null);

  // Stats
  const total = cotisations.length;
  const paid = cotisations.filter(c => c.status === PaymentStatus.PAID).length;
  const pending = cotisations.filter(c => c.status === PaymentStatus.PENDING).length;
  const overdue = cotisations.filter(c => c.status === PaymentStatus.OVERDUE).length;
  const totalAmount = cotisations.reduce((sum, c) => sum + c.amount, 0);

  // Filtrage
  const filteredCotisations = cotisations.filter(c => {
    const memberName = members.find(m => m.id === c.memberId)?.name || '';
    const matchesSearch = memberName.toLowerCase().includes(search.toLowerCase()) || c.notes?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleAdd = (cotisation: Omit<CotisationType, 'id'>) => {
    const newCotisation: CotisationType = { ...cotisation, id: Date.now().toString() };
    setCotisations(prev => [...prev, newCotisation]);
    setFeedback('Cotisation ajoutée avec succès');
    setShowAddModal(false);
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleDelete = (id: string) => {
    setCotisations(prev => prev.filter(c => c.id !== id));
    setFeedback('Cotisation supprimée avec succès');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleEdit = (cotisation: CotisationType) => {
    setCotisations(prev => prev.map(c => c.id === cotisation.id ? cotisation : c));
    setFeedback('Cotisation modifiée avec succès');
    setShowEditModal(false);
    setEditCotisation(null);
    setTimeout(() => setFeedback(''), 2000);
  };

  // Modal form state
  const [form, setForm] = useState<Omit<CotisationType, 'id'>>({
    memberId: '',
    amount: 0,
    paymentDate: new Date(),
    paymentMethod: PaymentMethod.CASH,
    status: PaymentStatus.PAID,
    year: new Date().getFullYear(),
    notes: '',
  });

  // Add modal open
  const openAddModal = () => {
    setForm({
      memberId: '',
      amount: 0,
      paymentDate: new Date(),
      paymentMethod: PaymentMethod.CASH,
      status: PaymentStatus.PAID,
      year: new Date().getFullYear(),
      notes: '',
    });
    setShowAddModal(true);
  };

  // Edit modal open
  const openEditModal = (cotisation: CotisationType) => {
    setEditCotisation(cotisation);
    setForm({
      memberId: cotisation.memberId,
      amount: cotisation.amount,
      paymentDate: cotisation.paymentDate,
      paymentMethod: cotisation.paymentMethod,
      status: cotisation.status,
      year: cotisation.year,
      notes: cotisation.notes || '',
    });
    setShowEditModal(true);
  };

  // Simulate edit for test
  const simulateEdit = () => {
    if (cotisations.length > 0) {
      openEditModal(cotisations[0]);
    }
  };

  // Form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'year' ? Number(value) : value,
      paymentDate: name === 'paymentDate' ? new Date(value) : prev.paymentDate,
    }));
  };

  // Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showAddModal) {
      handleAdd(form);
    } else if (showEditModal && editCotisation) {
      handleEdit({ ...editCotisation, ...form });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4" data-testid="cotisations-title">Cotisations</h1>
      {/* Feedback */}
      {feedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50" role="alert">
          {feedback}
        </div>
      )}
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow" data-testid="stat-total">
          <div className="text-sm text-gray-500" data-testid="stat-total-label">Total</div>
          <div className="text-xl font-bold" data-testid="stat-total-value">{total}</div>
        </div>
        <button className={`bg-green-100 rounded-lg p-4 shadow ${statusFilter === PaymentStatus.PAID ? 'border-2 border-green-500' : ''}`} onClick={() => setStatusFilter(PaymentStatus.PAID)} aria-label="Filtrer payées" data-testid="stat-paid">
          <div className="text-sm text-green-700" data-testid="stat-paid-label">Payées</div>
          <div className="text-xl font-bold" data-testid="stat-paid-value">{paid}</div>
        </button>
        <button className={`bg-yellow-100 rounded-lg p-4 shadow ${statusFilter === PaymentStatus.PENDING ? 'border-2 border-yellow-500' : ''}`} onClick={() => setStatusFilter(PaymentStatus.PENDING)} aria-label="Filtrer en attente" data-testid="stat-pending">
          <div className="text-sm text-yellow-700" data-testid="stat-pending-label">En attente</div>
          <div className="text-xl font-bold" data-testid="stat-pending-value">{pending}</div>
        </button>
        <button className={`bg-red-100 rounded-lg p-4 shadow ${statusFilter === PaymentStatus.OVERDUE ? 'border-2 border-red-500' : ''}`} onClick={() => setStatusFilter(PaymentStatus.OVERDUE)} aria-label="Filtrer en retard" data-testid="stat-overdue">
          <div className="text-sm text-red-700" data-testid="stat-overdue-label">En retard</div>
          <div className="text-xl font-bold" data-testid="stat-overdue-value">{overdue}</div>
        </button>
      </div>
      <div className="bg-white rounded-lg p-4 shadow mb-6" data-testid="stat-total-amount">
        <div className="text-sm text-gray-500" data-testid="stat-total-amount-label">Montant total perçu</div>
        <div className="text-xl font-bold" data-testid="stat-total-amount-value">{formatCurrency(totalAmount)}</div>
      </div>
      {/* Barre de recherche et bouton ajout */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Rechercher une cotisation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field flex-1"
          aria-label="Rechercher une cotisation"
        />
        <button
          className="btn-primary flex items-center gap-2"
          onClick={openAddModal}
          aria-label="Nouvelle cotisation"
          data-testid="add-cotisation-btn"
        >
          <Plus className="w-5 h-5" /> Nouvelle cotisation
        </button>
        <button
          className="btn-secondary"
          onClick={simulateEdit}
          aria-label="Simuler modification"
        >
          Simuler modification
        </button>
      </div>
      {/* Liste des cotisations */}
      <div className="bg-white rounded-lg shadow p-4">
        {filteredCotisations.length === 0 ? (
          <div className="text-center text-gray-500">Aucune cotisation trouvée</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Membre</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Méthode</th>
                <th>Statut</th>
                <th>Année</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCotisations.map(c => (
                <tr key={c.id}>
                  <td>{members.find(m => m.id === c.memberId)?.name || '-'}</td>
                  <td>{formatCurrency(c.amount)}</td>
                  <td>{formatDate(c.paymentDate)}</td>
                  <td>{c.paymentMethod === PaymentMethod.CASH ? 'Espèces' : c.paymentMethod === PaymentMethod.BANK_TRANSFER ? 'Virement' : c.paymentMethod === PaymentMethod.MOBILE_MONEY ? 'Mobile Money' : 'Chèque'}</td>
                  <td>{c.status === PaymentStatus.PAID ? 'Payée' : c.status === PaymentStatus.PENDING ? 'En attente' : 'En retard'}</td>
                  <td>{c.year}</td>
                  <td>{c.notes}</td>
                  <td>
                    <button className="text-red-500 hover:text-red-700 mr-2" onClick={() => handleDelete(c.id)} aria-label="Supprimer" role="button">Supprimer</button>
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => openEditModal(c)} aria-label="Modifier" role="button">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal ajout/modification */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="cotisation-modal-bg">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" data-testid="cotisation-modal">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold" data-testid={showAddModal ? 'modal-title-add' : 'modal-title-edit'}>
                {showAddModal ? 'Nouvelle cotisation' : 'Modifier cotisation'}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditCotisation(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fermer"
                aria-label="Fermer la modal"
                data-testid="modal-close-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4" data-testid="cotisation-form">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="memberId">Membre</label>
                <select
                  id="memberId"
                  name="memberId"
                  value={form.memberId}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Membre"
                  required
                >
                  <option value="">Sélectionner un membre</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="amount">Montant</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Montant"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="paymentDate">Date de paiement</label>
                <input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  value={form.paymentDate instanceof Date ? form.paymentDate.toISOString().split('T')[0] : form.paymentDate}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Date de paiement"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="paymentMethod">Méthode</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Méthode"
                  required
                >
                  <option value={PaymentMethod.CASH}>Espèces</option>
                  <option value={PaymentMethod.BANK_TRANSFER}>Virement</option>
                  <option value={PaymentMethod.MOBILE_MONEY}>Mobile Money</option>
                  <option value={PaymentMethod.CHECK}>Chèque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">Statut</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Statut"
                  required
                >
                  <option value={PaymentStatus.PAID}>Payée</option>
                  <option value={PaymentStatus.PENDING}>En attente</option>
                  <option value={PaymentStatus.OVERDUE}>En retard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="year">Année</label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={form.year}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Année"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="notes">Notes</label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  value={form.notes}
                  onChange={handleFormChange}
                  className="input-field"
                  aria-label="Notes"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditCotisation(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-label="Annuler"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  aria-label={showAddModal ? 'Ajouter' : 'Enregistrer'}
                >
                  {showAddModal ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
