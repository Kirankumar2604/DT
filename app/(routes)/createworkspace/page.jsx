'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Loader2Icon, SmilePlus } from 'lucide-react'
import { Input } from '../../../@/components/ui/input'
import CoverPicker from '../../_components/CoverPicker'
import EmojiPickerComponent from '../../_components/EmojiPickerComponent'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../../config/firebaseConfig'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link'


function CreateWorkspace() {
    const [coverImage, setCoverImage] = useState('/cover1.jpg');
    const [workspaceName, setWorkspaceName] = useState();
    const [emoji, setEmoji] = useState();
    const { user } = useUser();
    const { orgId } = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    // user to create a workspace and save it to the firestore
    const OnCreateWorkspace = async () => {
        setLoading(true);
        const workspaceId = Date.now();
        const result = await setDoc(doc(db, 'Workspaces', workspaceId.toString()), {
            workspaceName: workspaceName,
            coverImage: coverImage,
            emoji: emoji,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            Id: workspaceId,
            orgId: orgId ? orgId : user?.primaryEmailAddress?.emailAddress
        });
        // create a document for the workspace
        const docId = uuidv4();
        await setDoc(doc(db, 'workspacesDocuments', docId.toString()), {
            workspaceName: workspaceName,
            workspaceId: workspaceId,
            id: docId,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            coverImage: null,
            emoji: null,
            documentName: 'Untitled Document',
            documentOutput: []
        });

        await setDoc(doc(db, 'documentOutput', docId.toString()), {
            docid: docId,
            output: []
        });
        setLoading(false);
        router.replace('/workspace/' + workspaceId + '/' + docId);
    }
    return (
        <div className='p-10 md:px-36 lg:px-64 xl:px-96 py-28 '>
            <div className='shadow-2xl rounded-xl'>
                <CoverPicker value={coverImage} onChange={(newCover) => setCoverImage(newCover)}>
                    <div className='relative group cursor-pointer'>
                        <h2 className='hidden absolute font-bold p-4 w-full h-full group-hover:flex items-center justify-center'>
                            Change Cover
                        </h2>
                        <div className='group-hover:opacity-70'>
                            <Image
                                src={coverImage}
                                width={400}
                                height={400}
                                alt='cover'
                                className='w-full h-[150px] object-cover rounded-t-xl'
                            />
                        </div>
                    </div>
                </CoverPicker>
                {/* input section */}
                <div className='p-12'>
                    <h2 className='font-medium text-xl'>Create a new workspace</h2>
                    <h2 className='text-sm mt-2'>This a shared space where you can collaborate with you team.
                        you can always rename it later.
                    </h2>
                    <div className='mt-8 flex items-center gap-2'>
                        <EmojiPickerComponent setEmojiIcon={(v) => setEmoji(v)}>
                            <Button variant={"outline"}>
                                {emoji ? emoji : <SmilePlus />}
                            </Button>
                        </EmojiPickerComponent>
                        <Input placeholder="Workspace Name"
                            onChange={(e) => setWorkspaceName(e.target.value)}
                        />
                    </div>
                    <div className='mt-10 flex gap-5 justify-end'>
                        <Button disabled={!workspaceName?.length || loading}
                            onClick={OnCreateWorkspace}
                        >create {loading && <Loader2Icon className='animate-spin ml-2' />}</Button>
                        <Link href="/dashboard" passHref >
                        <Button variant={"outline"}>Cancel</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateWorkspace