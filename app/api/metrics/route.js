import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const usersList = usersSnapshot.docs.map((doc) => doc.data());
    return new Response(JSON.stringify({ users: usersList }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to load users. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
