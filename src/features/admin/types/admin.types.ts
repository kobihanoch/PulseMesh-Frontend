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

export type Device =
  | (Defibrillator & { deviceType: 'defibrillator' })
  | (LoraDevice & { deviceType: 'lora' });

export type DeviceList = { items: Device[]; pagination: Pagination };

export type IncidentCandidate = {
  candidateId: string;
  defibrillatorId: string;
  loraDeviceId: string | null;
  devEui: string | null;
  batteryPercentage: number | null;
  latitude: number;
  longitude: number;
  lastTransmissionAt: string;
  distanceMeters: number;
  status: 'notified' | 'accepted' | 'declined' | 'failed';
  notifiedAt: string;
  respondedAt: string | null;
  notifications: { push: 'simulated'; lora: 'simulated' | 'unavailable' };
};

export type Incident = {
  id: string;
  source: 'app' | 'emergency_center' | 'simulator';
  latitude: number;
  longitude: number;
  radiusMeters: number;
  status: 'active' | 'resolved' | 'cancelled';
  description: string | null;
  createdAt: string;
  closedAt: string | null;
  candidates?: IncidentCandidate[];
};

export type IncidentList = { items: Incident[]; pagination: Pagination };

export type TelemetryEntry = {
  deviceId: string;
  devEui: string;
  batteryPercentage: number;
  latitude: number;
  longitude: number;
  receivedAt: string;
};

export type TelemetryList = { items: TelemetryEntry[]; pagination: Pagination };

export type Notification = {
  type: 'incident' | 'low_battery';
  channel: 'push' | 'lora';
  status: 'simulated';
  registrantId: string;
  deviceId: string;
  incidentId?: string;
  createdAt: string;
};

export type NotificationList = { items: Notification[]; pagination: Pagination };
