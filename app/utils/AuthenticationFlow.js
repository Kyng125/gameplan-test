import { useState, useEffect } from "react";
import { auth } from "../../lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import SolanaConfig from "./SolanaConfig";
import NFTCheck from "./NFTCheck";
import SignIn from "./SignIn";

const App = () => {
  const [user, setUser] = useState(null);
  const [nftOwned, setNftOwned] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <SolanaConfig>
      <div>
        {user ? (
          <div>
            <h1>Welcome, {user.email}</h1>
            <NFTCheck setNftOwned={setNftOwned} />
            {nftOwned ? (
              <p>You own the NFT!</p>
            ) : (
              <p>You don&apos;t own the required NFT.</p>
            )}
          </div>
        ) : (
          <SignIn onSignIn={setUser} />
        )}
      </div>
    </SolanaConfig>
  );
};

export default App;
