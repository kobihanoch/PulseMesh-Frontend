export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type Defibrillator = {
  id: string;
  ownerId: string;
  isMobile: boolean;
  status: 'working' | 'maintenance' | 'out_of_service';
  createdAt: string;
  updatedAt: string;
};

export type LoraDevice = {
  id: string;
  ownerId: string;
  defibrillatorId: string | null;
  devEui: string;
  status: 'active' | 'inactive' | 'maintenance';
  batteryPercentage: number | null;
  latitude: number | null;
  longitude: number | null;
  lastTransmissionAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Registration = {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  medicalTraining: string | null;
  latitude: number | null;
  longitude: number | null;
  lastLocationAt: string | null;
  createdAt: string;
  updatedAt: string;
  defibrillators: Defibrillator[];
  loraDevices: LoraDevice[];
};

export type RegistrationList = { items: Registration[]; pagination: Pagination };
export type PaginatedCount = { pagination: Pagination };
