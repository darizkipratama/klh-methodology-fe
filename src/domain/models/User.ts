/**
 * User Model definition mapping to the expected backend response.
 */
export interface User {
  id: string;
  email: string;
  username: string;
  companyName?: string;
  userType: string;
  role: 'INTERNAL' | 'PUBLISHER';
}

export interface UserData {
  _id: string;
  username: string;
  email: string;
  companyName: string;
  role: string;
  userType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserResponse {
  success: boolean;
  data: UserData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}
