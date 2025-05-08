"use client"
import React from 'react'
import SideNav from '../_components/SideNav'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

function WorkspacePage({ params }) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!params?.workspaceid) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Workspace ID is missing</p>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="w-72">
        <SideNav params={params} />
      </div>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to your workspace</h1>
        <p className="text-gray-600">
          Select a document from the sidebar or create a new one to get started.
        </p>
      </div>
    </div>
  )
}

export default WorkspacePage