export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBoardRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface CreateItemRequest {
  boardId: string;
  title?: string;
  sourceUrl: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}