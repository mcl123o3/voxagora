"use client";
import React, { useState, useEffect } from 'react';
import { createPost, checkUserExist } from '@/app/actions'

// probar el uso de caching para cargar los datos
//import { caching } => "@/app/[locale]/components/caching/caching"

// poblar la base de datos antes de con queries.ts
import { populate } from "@/app/[locale]/components/queries/queries"


export default function NewPostPage() {
    const [userExists, setUserExists] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkUser() {
            const exists = await checkUserExist("Alice");
            setUserExists(exists !== null); // Explicitly check if the user object is not null
        }
        checkUser();
    }, []);

    useEffect(() => {
        if (userExists === false) {
            populate();
        }
    }, [userExists]);

    if (userExists === null) {
        return <div>Loading...</div>; // Or a more elaborate loading state
    }

    return (
        <form action={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="title" style={{ marginBottom: '5px' }}>Title:</label>
                <input id="title" name="title" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="content" style={{ marginBottom: '5px' }}>Content:</label>
                <textarea id="content" name="content" rows={10} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="authorId" style={{ marginBottom: '5px' }}>Author ID:</label>
                <input id="authorId" name="authorId" type="number" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input id="published" name="published" type="checkbox" style={{ marginRight: '5px' }} />
                <label htmlFor="published">Published</label>
            </div>
            <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Post</button>
        </form>
    )

}
