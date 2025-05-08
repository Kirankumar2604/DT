"use client"
import { useAuth, useUser } from '@clerk/nextjs'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import Logo from '../../../_components/Logo';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebaseConfig';
import { toast } from 'sonner';

function Header() {
  const { orgId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      saveUserData();
    }
  }, [user, orgId]);

  const saveUserData = async () => {
    if (!user) return;
    
    try {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        image: user?.imageUrl,
        createdAt: new Date().toISOString(),
        orgId: orgId || user?.primaryEmailAddress?.emailAddress,
        lastUpdated: new Date().toISOString()
      };

      await setDoc(doc(db, 'notezy_users', user.primaryEmailAddress.emailAddress), userData, { merge: true });
      console.log('User data saved successfully:', userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error('Failed to save user data');
    }
  };

  return (
    <div className='flex justify-between items-center p-4 shadow-sm bg-card border-b'>
      <Logo/>
      <OrganizationSwitcher 
        afterLeaveOrganizationUrl={'/dashboard'}
        afterCreateOrganizationUrl={'/dashboard'}
        appearance={{
          elements: {
            rootBox: "text-foreground",
            organizationSwitcherTrigger: "text-foreground",
            organizationSwitcherPopoverCard: "bg-card text-foreground",
          }
        }}
      />
      <UserButton
        appearance={{
          elements: {
            rootBox: "text-foreground",
            userButtonPopoverCard: "bg-card text-foreground",
          }
        }}
      />
    </div>
  )
}

export default Header