import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Upload } from 'lucide-react';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuthContext';
import { isValidEmail, isValidPhoneNumber } from '../utils';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    associationName: '',
    sigle: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    logo: null as File | null,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'associationName':
        return value.length < 3 ? 'Le nom doit contenir au moins 3 caractères' : '';
      case 'email':
        return !isValidEmail(value) ? 'Adresse email invalide' : '';
      case 'phone':
        return !isValidPhoneNumber(value) ? 'Numéro de téléphone invalide' : '';
      case 'password':
        return value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : '';
      case 'confirmPassword':
        return value !== formData.password ? 'Les mots de passe ne correspondent pas' : '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'logo' && key !== 'sigle') {
        const error = validateField(key, formData[key as keyof typeof formData] as string);
        if (error) errors[key] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name: formData.associationName,
        sigle: formData.sigle,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        logo: formData.logo || undefined,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Erreur lors de la création du compte:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du compte. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validation en temps réel
    if (fieldErrors[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      logo: file,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-montserrat font-bold text-gray-900">
          Créer votre espace association
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            connectez-vous si vous avez déjà un compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Affichage des erreurs globales */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Nom de l'association */}
            <div>
              <label htmlFor="associationName" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'association *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="associationName"
                  name="associationName"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Association des jeunes de..."
                  value={formData.associationName}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.associationName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.associationName}</p>
              )}
            </div>

            {/* Sigle */}
            <div>
              <label htmlFor="sigle" className="block text-sm font-medium text-gray-700 mb-2">
                Sigle (optionnel)
              </label>
              <input
                id="sigle"
                name="sigle"
                type="text"
                className="input-field"
                placeholder="AJD"
                value={formData.sigle}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field pl-10"
                  placeholder="contact@association.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input-field pl-10"
                  placeholder="+221 77 123 45 67"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Formats acceptés : +221 XX XXX XX XX, +224 XXX XXX XXX, 77XXXXXXX
              </p>
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Logo */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo de l'association (optionnel)
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour téléverser</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                  </div>
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {formData.logo && (
                <p className="mt-2 text-sm text-green-600">
                  Fichier sélectionné: {formData.logo.name}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                J'accepte les{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500">
                  politique de confidentialité
                </a>
              </label>
            </div>

            <div>
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Création en cours...' : 'Créer mon espace association'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
