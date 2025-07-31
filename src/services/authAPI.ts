/**
 * API d'authentification - Module mock pour les tests
 */

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/**
 * Authentification utilisateur
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Mock implementation for testing
  if (email === 'test@example.com' && password === 'password') {
    return {
      token: 'fake-jwt-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      }
    };
  }
  throw new Error('Invalid credentials');
};

/**
 * Inscription utilisateur
 */
export const register = async (data: RegisterData): Promise<LoginResponse> => {
  // Mock implementation for testing
  return {
    token: 'fake-jwt-token',
    user: {
      id: '2',
      email: data.email,
      name: data.name
    }
  };
};

/**
 * Déconnexion utilisateur
 */
export const logout = async (): Promise<void> => {
  // Mock implementation
  return Promise.resolve();
};

/**
 * Vérification du token
 */
export const verifyToken = async (token: string): Promise<User> => {
  // Mock implementation
  if (token === 'fake-jwt-token') {
    return {
      id: '1',
      email: 'test@example.com',
      name: 'Test User'
    };
  }
  throw new Error('Invalid token');
};
