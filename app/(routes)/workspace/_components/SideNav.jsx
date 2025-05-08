'use client'
import React, { useEffect, useState } from 'react'
import Logo from '../../../_components/Logo'
import { Bell, Loader2Icon, Plus } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { collection, doc, onSnapshot, query, where, addDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../../../../config/firebaseConfig'
import DocumentList from './DocumentList'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid'
import { Progress } from "../../../../@/components/ui/progress"
import { toast } from 'sonner'

function SideNav({ params }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [documentList, setDocumentList] = useState([])
  const [loading, setLoading] = useState(true)
  const [workspaceName, setWorkspaceName] = useState('')
  const MAX_FILE = 5

  // Debug logs
  useEffect(() => {
    console.log('SideNav mounted with params:', params)
    console.log('Workspace ID:', params?.workspaceid)
    console.log('User:', user)
  }, [params, user])

  // Fetch workspace name
  useEffect(() => {
    const fetchWorkspaceName = async () => {
      if (!params?.workspaceid) {
        console.log('No workspace ID available for fetching workspace name')
        return
      }
      
      try {
        console.log('Fetching workspace name for ID:', params.workspaceid)
        const workspaceDoc = await getDoc(doc(db, "workspaces", params.workspaceid))
        if (workspaceDoc.exists()) {
          const name = workspaceDoc.data().workspaceName || 'Untitled Workspace'
          console.log('Workspace name fetched:', name)
          setWorkspaceName(name)
        } else {
          console.log('Workspace not found')
          toast.error('Workspace not found')
        }
      } catch (error) {
        console.error("Error fetching workspace:", error)
        toast.error('Failed to load workspace')
      }
    }

    fetchWorkspaceName()
  }, [params?.workspaceid])

  // Get document list using real-time listener
  useEffect(() => {
    if (!params?.workspaceid) {
      console.log('No workspace ID available for document fetch')
      return
    }

    setLoading(true)
    console.log('Setting up document listener for workspace:', params.workspaceid)
    
    const q = query(
      collection(db, "workspacesDocuments"),
      where("workspaceId", "==", params.workspaceid)
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        console.log('Documents fetched:', docs)
        setDocumentList(docs)
        setLoading(false)
      }, 
      (error) => {
        console.error("Error in document subscription:", error)
        toast.error('Failed to load documents')
        setLoading(false)
      }
    )

    return () => {
      console.log('Cleaning up document listener')
      unsubscribe()
      setLoading(false)
    }
  }, [params?.workspaceid])

  const CreateNewDocument = async () => {
    console.log('Creating new document...')
    console.log('Current state:', {
      workspaceId: params?.workspaceid,
      user: user?.primaryEmailAddress?.emailAddress,
      documentCount: documentList?.length
    })

    if (documentList?.length >= MAX_FILE) {
      toast.error('You have reached the maximum file limit of 5. Please upgrade to add more files.', {
        action: {
          label: 'Upgrade',
          onClick: () => console.log('upgrade'),
        },
      })
      return
    }

    if (!params?.workspaceid || !user) {
      console.log('Missing required data:', {
        workspaceId: params?.workspaceid,
        user: !!user
      })
      toast.error('Workspace ID or user is missing')
      return
    }

    try {
      setLoading(true)
      const docId = uuidv4()
      console.log('Creating document with ID:', docId)
      
      const documentData = {
        workspaceId: params.workspaceid,
        docId: docId,
        documentName: 'Untitled Document',
        createdBy: user.primaryEmailAddress.emailAddress,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        Output: {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: "Start typing here..."
              }
            }
          ]
        }
      }

      console.log('Document data:', documentData)
      await addDoc(collection(db, "workspacesDocuments"), documentData)
      console.log('Document created successfully')
      router.push(`/workspace/${params.workspaceid}/${docId}`)
      toast.success('Document created successfully')
    } catch (error) {
      console.error("Error creating document:", error)
      toast.error('Failed to create document')
    } finally {
      setLoading(false)
    }
  }

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <Loader2Icon className="animate-spin h-8 w-8 text-gray-500" />
  //     </div>
  //   )
  // }

  return (
    <div className="h-screen md:w-72 hidden md:block fixed bg-blue-50 p-3 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Logo />
        <Bell className="h-5 w-5 text-gray-500" />
      </div>

      <hr className="my-5" />

      {/* Workspace Title and Button */}
      <div>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Workspace Name: {workspaceName}</h2>
          <Button size="sm" onClick={CreateNewDocument} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Document List */}
      <DocumentList 
        documents={documentList} 
        workspaceId={params.workspaceid} 
      />

      {/* Progress Bar */}
      <div className="absolute bottom-10 w-[90%] p-3">
        <Progress value={(documentList?.length / MAX_FILE) * 100} />
        <h2>
          <strong>{documentList?.length}</strong> Out of <strong>5</strong> files used
        </h2>
        <h2 className="text-sm"> <strong>Upgrade for unlimited access</strong> </h2>
      </div>
    </div>
  )
}

export default SideNav
