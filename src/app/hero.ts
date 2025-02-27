export interface ApiResponse<T> {
  data: {
    results: T[];
  };
}

export interface Hero {
  id: number;
  name: string;
  description?: string;
  thumbnail: {
    path: string;
    extension: string;
  };
}
