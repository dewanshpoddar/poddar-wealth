/**
 * Standard API Response Structures for Poddar Wealth APIs
 */

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  code?: string
  details?: unknown
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Standard HTTP helper to build API responses
 */
import { NextResponse } from 'next/server'

export const apiResponse = {
  success: <T>(data: T, status = 200) => {
    return NextResponse.json({ success: true, data } as ApiSuccessResponse<T>, { status })
  },
  error: (message: string, code?: string, status = 400, details?: unknown) => {
    return NextResponse.json({ success: false, error: message, code, details } as ApiErrorResponse, { status })
  }
}
