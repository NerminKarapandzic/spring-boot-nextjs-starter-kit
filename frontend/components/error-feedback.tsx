"use client"

import { cn } from '@/lib/utils'
import { HttpErrorResponse } from '@/models/http/HttpErrorResponse'
import React from 'react'

interface ErrorFeedbackProps extends React.HTMLAttributes<HTMLDivElement>{
  data: HttpErrorResponse | undefined
}
export default function ErrorFeedback({data, className}: ErrorFeedbackProps) {
  if (!data) return <></>

  return (
    <div className={cn('w-full flex flex-col p-4 rounded-md bg-red-200 text-red-800', className)}>
      {data.message && <p className='font-bold'>{data.message}</p>}

      {data.errors && (
        <ul className='list-disc list-inside mt-2'>
          {Object.entries(data.errors).map(([key, value]) => (
            <li key={key}><span className='font-semibold'>{key}</span> {value}</li>
          ))}
        </ul>
      )}

      {data.generalErrors && (
        <ul className='list-disc list-inside'>
          {data.generalErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

    </div>
  )
}
