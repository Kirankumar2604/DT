"use client"
import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebaseConfig';
import { toast } from 'sonner';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table'
import GenerateAITemplate from './GenerateAITemplate';

function RichDocumentEditor({ params, setGeneratedTemplate }) {
  const ref = useRef();
  const { user } = useUser();
  const [editorInstance, setEditorInstance] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const saveContent = async (content) => {
    try {
      const docRef = doc(db, "documentOutput", params.documentid);
      const contentString = JSON.stringify(content);
      await updateDoc(docRef, {
        Output: contentString,
        editedBy: user.primaryEmailAddress.emailAddress,
        lastModified: new Date().toISOString()
      });
      // toast.success('Document saved');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  const InitEditor = async () => {
    if (!editorInstance) {
      let initialContent = {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: "Start typing here..."
            }
          }
        ]
      };

      try {
        const docRef = doc(db, "documentOutput", params.documentid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.Output) {
            try {
              initialContent = typeof data.Output === 'string' 
                ? JSON.parse(data.Output) 
                : data.Output;
            } catch (parseError) {
              console.error('Error parsing document content:', parseError);
              toast.error('Error loading document content');
            }
          }
        } else {
          // Create new document if it doesn't exist
          const contentString = JSON.stringify(initialContent);
          await setDoc(docRef, {
            Output: contentString,
            createdBy: user.primaryEmailAddress.emailAddress,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
          });
        }

        // Initialize editor with the content
        const editor = new EditorJS({
          holder: 'editorjs',
          data: initialContent,
          onChange: async () => {
            try {
              const content = await editor.save();
              saveContent(content);
            } catch (error) {
              console.error('Error saving content:', error);
            }
          },
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                levels: [2, 3, 4],
                defaultLevel: 2
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered',
                types: ['unordered', 'ordered']
              }
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true
            },
            table: {
              class: Table,
              inlineToolbar: true
            }
          },
          onReady: () => {
            console.log('Editor is ready');
            setEditorInstance(editor);
            setIsEditorReady(true);
          },
          onError: (err) => {
            console.error('Editor error:', err);
            toast.error('Editor error occurred');
          }
        });

      } catch (error) {
        console.error('Error initializing editor:', error);
        toast.error('Failed to initialize editor');
      }
    }
  };

  useEffect(() => {
    if (params?.documentid && user) {
      InitEditor();
    }
    return () => {
      if (editorInstance && typeof editorInstance.destroy === 'function') {
        editorInstance.destroy();
        setEditorInstance(null);
        setIsEditorReady(false);
      }
    };
  }, [params?.documentid, user]);

  const handleTemplateGeneration = async (output) => {
    if (!isEditorReady || !editorInstance) {
      toast.error('Editor is not ready yet. Please wait...');
      return;
    }

    try {
      // Clear the current editor content
      await editorInstance.clear();
      
      // Ensure the output is properly formatted
      const formattedOutput = {
        ...output,
        blocks: output.blocks.map(block => {
          if (block.type === 'list') {
            return {
              ...block,
              data: {
                ...block.data,
                style: block.data.style || 'unordered'
              }
            };
          }
          return block;
        })
      };

      // Render the new content
      await editorInstance.render(formattedOutput);
      
      // Save the content to Firestore
      await saveContent(formattedOutput);
      toast.success('Template generated successfully');
    } catch (error) {
      console.error('Error rendering template:', error);
      toast.error('Failed to render template');
    }
  };

  return (
    <div className='px-20 ml-10'>
      <div id='editorjs'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
        <GenerateAITemplate setGeneratedTemplate={handleTemplateGeneration}/>
      </div>
    </div>
  );
}

export default RichDocumentEditor;
