export interface EnquiryPayload {
  lane:        'festival' | 'wedding' | 'corporate' | null
  eventType:   'party' | 'wedding' | 'corporate' | 'festival' | 'other'
  date:        string | null
  name:        string
  email:       string
  phone:       string
  region:      string
  guests:      string | null
  notes:       string
  submittedAt: string
}

export interface StoredEnquiry extends EnquiryPayload {
  id: string
}

export interface BookedDate {
  date: string
  calEventId: string | null
}

export interface AvailabilityResponse {
  unavailable: string[]
}
