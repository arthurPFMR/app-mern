import React, { useEffect, useState } from "react";
import Routes from "./components/Routes";
import { UidContext } from "./components/AppContext";
import axios from "axios";

const App = () => {
  // Utilisation du contexte uid afin de partager l'id (uid) de l'user entre les composants
  const [uid, setUid] = useState(null);
  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data)
        })
        .catch((err) => console.log("No token"));
    };
    fetchToken();
    // UseEffect s'exécute chaque fois que l'état uid change
  }, [uid]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
