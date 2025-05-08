"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import DocumentOptions from './DocumentOptions'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../../../config/firebaseConfig'
import { toast } from 'sonner'

function DocumentList({ documents = [], workspaceId }) {
  const router = useRouter()

  const handleDocumentClick = (docId) => {
    if (!workspaceId) {
      toast.error('Workspace ID is missing')
      return
    }
    router.push(`/workspace/${workspaceId}/${docId}`)
  }

  const DeleteDocument = async (docId) => {
    try {
      await deleteDoc(doc(db, "workspacesDocuments", docId))
      toast.success("Document Deleted Successfully")
    } catch (error) {
      toast.error("Error deleting document")
    }
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">No documents available.</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      {documents.map((doc, index) => (
        <div
          key={doc.id || index}
          onClick={() => handleDocumentClick(doc.id)}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            {doc.documentName?.[0]?.toUpperCase() || 'D'}
          </div>
          <div>
            <h3 className="text-sm font-medium">{doc.documentName || 'Untitled Document'}</h3>
            <p className="text-xs text-gray-500">
              {doc.createdBy || 'Unknown user'} • {new Date(doc.createdAt?.toDate?.() || doc.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <DocumentOptions doc={doc} deleteDocument={DeleteDocument} />
        </div>
      ))}
    </div>
  )
}

export default DocumentList
