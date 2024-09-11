// app/api/addData/route.js

import { db } from "@/lib/firebaseConfig"; // Adjust the path if necessary
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  const { data } = await req.json();

  try {
    const docRef = await addDoc(collection(db, "your_collection_name"), {
      ...data,
      timestamp: new Date(),
    });
    return new Response(JSON.stringify({ id: docRef.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    return new Response(JSON.stringify({ error: "Error adding document" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
    },
  });
}
