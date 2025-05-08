'use client'
import React, { useEffect, useState } from 'react'
import SideNav from '../../_components/SideNav'
import DocumentEditorSection from '../../_components/DocumentEditorSection'
import { useParams } from 'next/navigation'
import { Room } from '../../../../Room'

function WorkspaceDocument() {

  const params = useParams();
  const [isReady, setIsReady] = useState(false);

  

  useEffect(() => {
    if (params?.workspaceid && params?.documentid) {
      setIsReady(true);
    }
  }, [params]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Room params={params}>
    <div>
      <div>
        <SideNav params={params} />
      </div>
      <div className='md:ml-72'>
        <DocumentEditorSection params={params} />
      </div>
    </div>
    </Room>
  )
}

export default WorkspaceDocument