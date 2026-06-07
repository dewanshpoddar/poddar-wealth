export interface NewsletterSubscribeRequest {
  email: string
  language?: string
}

export interface NewsletterSubscribeSuccess {
  success: true
  message: string
}

export interface NewsletterSubscribeError {
  success: false
  error: string
}

export type NewsletterSubscribeResponse =
  | NewsletterSubscribeSuccess
  | NewsletterSubscribeError
