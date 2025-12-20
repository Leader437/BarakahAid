export enum DonationRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
  CLOSED = 'CLOSED',
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DonationOfferStatus {
  AVAILABLE = 'AVAILABLE',
  CLAIMED = 'CLAIMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum NotificationType {
  DONATION = 'DONATION',
  CAMPAIGN = 'CAMPAIGN',
  VOLUNTEER = 'VOLUNTEER',
  SYSTEM = 'SYSTEM',
  EMERGENCY = 'EMERGENCY',
}

export enum PaymentGateway {
  JAZZCASH = 'JAZZCASH',
  EASYPAISA = 'EASYPAISA',
  CARD = 'CARD',
}
