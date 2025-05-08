import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Button } from '../../../../components/ui/button'
import DocumentHeader from './DocumentHeader'
import DocumentInfo from './DocumentInfo'
import RichDocumentEditor from './RichDocumentEditor'
import { MessageCircle, X } from 'lucide-react'
import CommentBox from './CommentBox'


function DocumentEditorSection({params}) {

  const [openComment,setOpenComment] = useState(false);
  return (
    <div> 
        {/* Header */}
        <DocumentHeader/>
        
        {/* Document Info */}
        <DocumentInfo params={params}/>

        {/* Rich Text Editor */}
        <RichDocumentEditor params={params}/>

        <div className='fixed bottom-5 right-5 z-50'>
         <Button onClick={() => setOpenComment(!openComment)}>
          {openComment? <X/> : <MessageCircle/>}</Button>
         {openComment && <CommentBox/>}
        </div>
        
    </div>
  )
}

export default DocumentEditorSection