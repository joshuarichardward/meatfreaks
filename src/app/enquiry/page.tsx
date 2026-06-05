import type { Metadata } from 'next'
import { Suspense } from 'react'
import EnquiryClient from './EnquiryClient'

export const metadata: Metadata = {
  title: 'Start an Enquiry',
}

export default function EnquiryPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: 'var(--char)',
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 28,
              height: 28,
              borderRadius: 100,
              border: '3px solid rgba(244,234,215,.3)',
              borderTopColor: 'var(--ember)',
              animation: 'spin .7s linear infinite',
            }}
          />
        </div>
      }
    >
      <EnquiryClient />
    </Suspense>
  )
}
