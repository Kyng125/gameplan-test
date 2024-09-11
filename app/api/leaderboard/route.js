import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET(request) {
  try {
    const leaderboardRef = collection(db, "users");
    const leaderboardQuery = query(
      leaderboardRef,
      orderBy("totalPoints", "desc")
    );
    const leaderboardSnapshot = await getDocs(leaderboardQuery);
    const leaderboardList = leaderboardSnapshot.docs.map((doc) => doc.data());
    return new Response(JSON.stringify(leaderboardList), { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load leaderboard. Please try again later." }), 
      { status: 500 }
    );
  }
}
