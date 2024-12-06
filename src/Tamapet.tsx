import React, { useState, useEffect } from "react";

const TIME: number = 2000; // 2 Seconds
const MAX_FULLNESS: number = 100;
const MAX_HAPPINESS: number = 100;
const MAX_ENERGY: number = 100;

type Action = "feed" | "play" | "sleep" | "check";

interface TamaState {
  fullness: number;
  happiness: number;
  energy: number;
  species: string;
  name: string;
}

const species = {
  egg: {
    fullness: 0,
    happiness: 0,
    energy: 0
  },
  kitty: {
    fullness: 30,
    happiness: 30,
    energy: 50
  },
  whale: {
    fullness: 10,
    happiness: 60,
    energy: 20
  },
  mochi: {
    fullness: 90,
    happiness: 80,
    energy: 90
  }
};

const initialState: TamaState = {
  fullness: species.egg.fullness,
  happiness: species.egg.happiness,
  energy: species.egg.energy,
  species: "egg",
  name: ""
}

const encodeState = (state: TamaState): string => {
  const json = JSON.stringify(state);
  return btoa(json);
};

const decodeState = (encodedState: string): TamaState => {
  try {
    const decoded = atob(encodedState);
    return JSON.parse(decoded);
  } catch(error) {
    console.error("Error when trying to decode pet data: ", error);
    return { ...initialState };
  }
};

const Tamapet: React.FC = () => {
  const [state, setState] = useState<TamaState>(initialState);

  // Checks if there already is data in sessionStorage
  useEffect(() => { 
    const storedData = sessionStorage.getItem("tamaState");
    if (storedData) {
      const decodedState = decodeState(storedData);
      setState(decodedState);
    }
  }, []);

  // Every time the state changes we update sessionStorage to reflect it
  useEffect(() => {
    const encoded = encodeState(state);
    sessionStorage.setItem("tamaState", encoded);
  }, [state]);

  // This handles the pet state by decrementing all stats by the set TIME.
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prevState) => {
        const newFullness = Math.max(prevState.fullness - 1, 0);
        const newHappiness = Math.max(prevState.happiness - 1, 0);
        const newEnergy = Math.max(prevState.energy - 1, 0);

        return {
          ...prevState,
          fullness: newFullness,
          happiness: newHappiness,
          energy: newEnergy
        };
      });
    }, TIME);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: Action) => {
    setState((prevState) => {
      switch (action) {
        case "feed":
          return {
            ...prevState,
            fullness: Math.min(prevState.fullness + 20, MAX_FULLNESS),
            energy: Math.min(prevState.energy + 10, MAX_ENERGY)
          };
        case "play":
          return {
            ...prevState,
            happiness: Math.min(prevState.happiness + 20, MAX_HAPPINESS),
            fullness: Math.max(prevState.fullness - 10, 0),
            energy: Math.max(prevState.energy - 10, 0)
          };
        case "sleep":
          return {
            ...prevState,
            energy: Math.min(prevState.energy + 30, MAX_ENERGY)
          };
        case "check":
          return prevState;
        default:
          return prevState;
      }
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      name: e.target.value
    }));
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setState((prevState) => {
      const updatedState = { ...prevState, name: prevState.name };
      const encoded = encodeState(updatedState);
      sessionStorage.setItem("tamaState", encoded);
      return updatedState;
    });
  };

  const handleSpeciesSelect = (speciesKey: keyof typeof species) => {
    const selectedSpecies = species[speciesKey];
    setState((prevState) => ({
      ...prevState,
      species: speciesKey,
      fullness: selectedSpecies.fullness,
      happiness: selectedSpecies.happiness,
      energy: selectedSpecies.energy
    }));
  };

  return (
    <div>
      <h1>Tamapet: {state.name || "Tamapet not named!"}</h1>

      {!state.species && (
        <div>
          <h2>Select a species for your Tamapet!</h2>
          {Object.keys(species).map((key) => (
            <button key={key} onClick={() => handleSpeciesSelect(key as keyof typeof species)}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button> 
          ))} 
        </div>
      )}

      {state.species && !state.name && (
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={state.name}
            onChange={handleNameChange}
            placeholder="Enter a name for your tamapet!"
            required
          />
        </form>
      )}

      <p>Fullness: {state.fullness}</p>
      <p>Happiness: {state.happiness}</p>
      <p>Energy: {state.energy}</p>

      <div>
        <button onClick={() => handleAction("feed")} disabled={state.fullness === MAX_FULLNESS}>
          Feed
        </button>
        <button onClick={() => handleAction("play")} disabled={state.energy === 0 || state.fullness === 0}>
          Play
        </button>
        <button onClick={() => handleAction("sleep")} disabled={state.energy === MAX_ENERGY}>
          Sleep
        </button>
        <button onClick={() => handleAction("check")}>
          Status Check
        </button>
      </div>
    </div>
  );
};

export default Tamapet;
