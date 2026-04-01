/**
 * User Model definition mapping to the expected backend response.
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'INTERNAL' | 'EXTERNAL';
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}
