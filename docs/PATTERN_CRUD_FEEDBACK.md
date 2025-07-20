# Pattern de robustesse CRUD & feedback pour Open Community Manager

Ce pattern permet d'automatiser la robustesse UX et la testabilité des pages CRUD (Cotisations, Finances, Billing, etc.) avec feedback utilisateur, selectors accessibles et support multi-format monétaire (€, FCFA).

## 1. Structure du composant
- Utiliser des états locaux pour le feedback (`feedbackMessage` ou `feedback`).
- Afficher le feedback en haut de la page avec un data-testid unique (ex: `data-testid="finances-feedback"`).
- Utiliser des data-testid sur tous les éléments clés (boutons, totaux, lignes, actions).
- Gérer les handlers CRUD (ajout, suppression, modification) avec feedback et timer.
- Rendre le composant accessible (aria-label, role, etc.).

## 2. Exemple d'implémentation
```tsx
// ...imports...
const [feedback, setFeedback] = useState('');
// ...handlers CRUD...
return (
  <div>
    {feedback && <div data-testid="page-feedback">{feedback}</div>}
    <button data-testid="add-btn" onClick={handleAdd}>Ajouter</button>
    <table data-testid="table">
      {/* ... */}
      <button data-testid={`delete-btn-${item.id}`} onClick={() => handleDelete(item.id)}>Supprimer</button>
    </table>
  </div>
);
```

## 3. Exemple de test robuste
```tsx
it('affiche le feedback après ajout', async () => {
  render(<Page />);
  fireEvent.click(screen.getByTestId('add-btn'));
  await waitFor(() => expect(screen.getByTestId('page-feedback')).toHaveTextContent(/ajouté/i));
});

it('affiche le feedback après suppression', async () => {
  render(<Page />);
  fireEvent.click(screen.getByTestId('delete-btn-1'));
  await waitFor(() => expect(screen.getByTestId('page-feedback')).toHaveTextContent(/supprimé/i));
});
```

## 4. Support multi-format monétaire
- Utiliser des regex dans les tests pour matcher les formats français et FCFA :
```tsx
expect(text.replace(/\s/g, '')).toMatch(/(29,99€|€29,99|29999FCFA|FCFA29999|29 999FCFA|FCFA29 999)/);
```

## 5. Réutilisation
- Copier ce pattern pour toute nouvelle page CRUD ou transactionnelle.
- Adapter les data-testid et feedback selon le contexte métier.
- Vérifier la cohérence mobile/desktop et l'accessibilité.

---
Ce guide garantit la robustesse, l'accessibilité et la testabilité des modules principaux d'Open Community Manager.
