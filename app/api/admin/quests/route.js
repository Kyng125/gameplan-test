import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// Handle GET request
export async function GET(req) {
  try {
    const querySnapshot = await getDocs(collection(db, "quests"));
    const questsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(questsData), { status: 200 });
  } catch (error) {
    console.error("Error fetching quests:", error);
    return new Response(JSON.stringify({ error: "Error fetching quests" }), { status: 500 });
  }
}

// Handle POST request
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, twitterPostId, pointsReward, nftReward } = body;

    await addDoc(collection(db, "quests"), {
      title,
      description,
      twitterPostId,
      pointsReward,
      nftReward,
      isActive: true,
    });

    return new Response(JSON.stringify({ message: "Quest added successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error adding quest:", error);
    return new Response(JSON.stringify({ error: "Error adding quest" }), { status: 500 });
  }
}

// Handle PUT request
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, description, twitterPostId, pointsReward, nftReward } = body;

    await updateDoc(doc(db, "quests", id), {
      title,
      description,
      twitterPostId,
      pointsReward,
      nftReward,
      isActive: true,
    });

    return new Response(JSON.stringify({ message: "Quest updated successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error updating quest:", error);
    return new Response(JSON.stringify({ error: "Error updating quest" }), { status: 500 });
  }
}

// Handle DELETE request
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    await deleteDoc(doc(db, "quests", id));

    return new Response(JSON.stringify({ message: "Quest deleted successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting quest:", error);
    return new Response(JSON.stringify({ error: "Error deleting quest" }), { status: 500 });
  }
}
