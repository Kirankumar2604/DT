"use client"
import { useAuth, useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { Button } from '../../../../components/ui/button';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CreateWorkspace from '../../createworkspace/page';
import WorkspaceItemList from './WorkspaceItemList';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../config/firebaseConfig';

function WorkspaceList() {
  const {user}=useUser();
  const [workspaceList,setworkspaceList]=useState([]);
  const {orgId} = useAuth();

  useEffect(
    ()=>{
      user&&getWorkspaceList()
    },[orgId,user])

  const getWorkspaceList = async()=>{
    try {
      const q=query(collection(db,'Workspaces'),where('orgId','==',orgId?orgId:user?.primaryEmailAddress?.emailAddress))
      const querySnapshot = await getDocs(q);
      const workspaces = [];

      querySnapshot.forEach((doc)=>{
        workspaces.push({
          id: doc.id,  // Include the document ID
          ...doc.data()
        });
      });
      
      setworkspaceList(workspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  }

  return (
    <div className='my-10 p-10 md:px-24 lg:px-36 xl:px-52 '>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>Hello, {user?.fullName}</h2>
        <Link href={'/createworkspace'}><Button className='h-10 w-10'>+</Button></Link>
        
      </div>

      <div className='mt-10 flex justify-between items-center'>
        <div >
          <h2 className='font-medium text-purple-600 '>Workspaces</h2>
        </div>
        <div className='flex gap-2'>
          <LayoutGrid/>
          <AlignLeft/>
      </div>
      </div>
      {workspaceList.length==0?
        <div className='flex flex-col justify-center items-center my-10'>
            <Image src={'/center_img.png'} width={200} height={200} alt='workspace'/>
            <h2>Create a new workspace</h2>
            <Link href={'/createworkspace'}><Button variant={'outline'} className={'my-3'}>+ New Workspace</Button></Link>
            
        </div>:
        <div><WorkspaceItemList workspaceList={workspaceList}/> </div>
      }
      
    </div>
  )
}

export default WorkspaceList