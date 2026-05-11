export interface SearchQuery {
  q?: string;
  category?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
  is_free?: boolean;
  page?: number;
  limit?: number;
  sort_by?: string;
}

export interface NearbyQuery {
  latitude: number;
  longitude: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface MapBoundsQuery {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
