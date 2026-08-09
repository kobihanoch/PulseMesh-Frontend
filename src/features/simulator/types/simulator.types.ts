export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type IncidentCandidate = Coordinates & {
  candidateId: string;
  defibrillatorId: string;
  loraDeviceId: string | null;
  devEui: string | null;
  batteryPercentage: number | null;
  lastTransmissionAt: string;
  distanceMeters: number;
  status: 'notified' | 'accepted' | 'declined' | 'failed';
  notifications: {
    push: 'simulated';
    lora: 'simulated' | 'unavailable';
  };
};

export type Incident = Coordinates & {
  id: string;
  radiusMeters: number;
  status: 'active' | 'resolved' | 'cancelled';
  createdAt: string;
  candidates: IncidentCandidate[];
};
