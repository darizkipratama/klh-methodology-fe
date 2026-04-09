export interface MetadataField {
  _id: string;
  key: string;
  label: string;
  dataType: 'STRING' | 'DATE' | 'SELECT';
  isRequired: boolean;
  options: string[];
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MetadataListResponse {
  success: boolean;
  data: MetadataField[];
}

export interface MetadataCreateResponse {
  success: boolean;
  message: string;
  data: MetadataField;
}

export interface MetadataCreatePayload {
  key: string;
  label: string;
  dataType: string;
  isRequired: boolean;
  options?: string[];
  order: number;
}
