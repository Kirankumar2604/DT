"use client"
import React, { useEffect, useState } from 'react'
import CoverPicker from '../../../_components/CoverPicker'
import Image from 'next/image';
import { SmilePlus } from 'lucide-react';
import EmojiPickerComponent from '../../../_components/EmojiPickerComponent';
import { doc , documentId, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebaseConfig';
import { toast } from 'sonner';


function DocumentInfo({params}) {
    const [emoji,setEmoji]=useState();
    const [coverImage,setCoverImage]=useState('/cover1.jpg');
    const [documentInfo,setdocumentInfo]=useState();

    useEffect(() => {
        params&&GetDocumentInfo();
    },[params])
    /**
     * used to get the document info from the firestore
     */
    const GetDocumentInfo=async() => {
        const docRef =doc(db, 'workspacesDocuments', params?.documentid);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            const data = docSnap.data();
            console.log('Document data:', data);
            setdocumentInfo(data);
            setEmoji(docSnap.data()?.emoji);
            docSnap.data()?.coverImage&&setCoverImage(docSnap.data()?.coverImage);
        } 
        else {
            console.log('No such document!');
        }
    }

    const updateDocumentInfo=async(key,value) => {
        const docRef = doc(db, 'workspacesDocuments', params?.documentid);
        await updateDoc(docRef, {
            [key]: value
        }); 
        toast.success('Document updated successfully');
    }

  return (
    <div>
        {/* Cover */}
        <CoverPicker setnewCover={(cover)=>{
            setCoverImage(cover)
            updateDocumentInfo('coverImage',cover);
        }} >
            <div className='relative group cursor-pointer'>
                <h2 className='hidden absolute font-bold p-4 w-full h-full group-hover:flex items-center justify-center'>Change Cover</h2>
                <div className='group-hover:opacity-70'>
                    <Image src={coverImage} width={400} height={400} alt='cover'
                    className='w-full h-[200px] object-cover rounded-t-xl'
                    />
                </div>
            </div>
        
        </CoverPicker>
        {/* Emoji Picker */}
        <div className='absolute ml-10 mt-[-40px] cursor-pointer'>
         <EmojiPickerComponent setEmojiIcon={(emoji)=>{
            setEmoji(emoji)
            updateDocumentInfo('emoji',emoji);
         }}>
            <div className='bg-[#ffffffb0] p-4 rounded-md'>
                {emoji?<span className='text-5xl'>{emoji}</span>:<SmilePlus className='h-10 w-10 text-gray-500'/>}
             </div>
        </EmojiPickerComponent>  
        </div>  
          
        {/* File Name */}

        <div className='mt-10 p-10'>
            <input type="text" 
            placeholder='Untitled Document'
            defaultValue={documentInfo?.documentName}
            className='font-bold text-4xl w-full p-4 outline-none'
            onBlur={(event)=>{
                updateDocumentInfo('documentName',event.target.value);
            }}
            />
        </div>

    </div> 
  )
}

export default DocumentInfo