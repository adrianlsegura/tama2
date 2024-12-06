import React, { useState, useEffect } from "react";
import "./Tamapet.css";

import feedIcon from "./assets/food.png";
import playIcon from "./assets/play.png";
import cleanIcon from "./assets/clean.png";
import medIcon from "./assets/med.png";
import poopIcon from "./assets/poop.png";
import tamagotchiDefault from "./assets/happy.png";

const TIME = 2000; // 2 seconds
const MAX_VALUE = 100;

type Action = "feed" | "play" | "clean" | "medicine";

interface TamaState {
  fullness: number;
  happiness: number;
  energy: number;
  name: string;
}

const initialState: TamaState = {
  fullness: 70,
  happiness: 70,
  energy: 70,
  name: "",
};

const Tamapet: React.FC = () => {
  const [state, setState] = useState<TamaState>(initialState);
  const [message, setMessage] = useState("");
  const [showPoop, setShowPoop] = useState(false);
  const [isNamed, setIsNamed] = useState(false);

  
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        fullness: Math.max(prev.fullness - 1, 0),
        happiness: Math.max(prev.happiness - 1, 0),
        energy: Math.max(prev.energy - 1, 0),
      }));
    }, TIME);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: Action) => {
    switch (action) {
      case "feed":
        setState((prev) => ({
          ...prev,
          fullness: Math.min(prev.fullness + 10, MAX_VALUE),
          energy: Math.min(prev.energy + 5, MAX_VALUE),
        }));
        setMessage("Yum! That was delicious!");
        setShowPoop(true);
        break;
      case "play":
        setState((prev) => ({
          ...prev,
          happiness: Math.min(prev.happiness + 15, MAX_VALUE),
          fullness: Math.max(prev.fullness - 5, 0),
          energy: Math.max(prev.energy - 5, 0),
        }));
        setMessage("Yay! That was fun!");
        break;
      case "clean":
        setShowPoop(false);
        setMessage("Thank you for cleaning!");
        break;
      case "medicine":
        setState((prev) => ({
          ...prev,
          happiness: Math.min(prev.happiness + 10, MAX_VALUE),
          energy: Math.min(prev.energy + 10, MAX_VALUE),
        }));
        setMessage("Feeling better now!");
        break;
      default:
        setMessage("");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNamed(true);
  };

  return (
    <div className="tamapet-container">
      {!isNamed ? (
        <div className="name-pet">
          <h2>Name Your Tamagotchi</h2>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={state.name}
              onChange={handleNameChange}
              placeholder="Enter your pet's name"
              required
              className="name-input"
            />
            <button type="submit" className="name-submit-button">
              Save Name
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Sidebar for Actions */}
          <div className="sidebar">
            <button className="action-button" onClick={() => handleAction("feed")}>
              <img src={feedIcon} alt="Feed" />
            </button>
            <button className="action-button" onClick={() => handleAction("play")}>
              <img src={playIcon} alt="Play" />
            </button>
            <button className="action-button" onClick={() => handleAction("clean")}>
              <img src={cleanIcon} alt="Clean" />
            </button>
            <button className="action-button" onClick={() => handleAction("medicine")}>
              <img src={medIcon} alt="Medicine" />
            </button>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <h1>{state.name || "Your Tamagotchi"}</h1>

            {/* Meters */}
            <div className="meters">
              <div className="meter">
                <p>Fullness</p>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${state.fullness}%` }}></div>
                </div>
              </div>
              <div className="meter">
                <p>Happiness</p>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${state.happiness}%` }}></div>
                </div>
              </div>
              <div className="meter">
                <p>Energy</p>
                <div className="meter-bar">
                  <div className="meter-fill" style={{ width: `${state.energy}%` }}></div>
                </div>
              </div>
            </div>

            <div className="tama-display">
              <img src={tamagotchiDefault} alt="Tamagotchi" className="tama-image" />
              {showPoop && <img src={poopIcon} alt="Poop" className="poop-icon" />}
            </div>

            {message && <div className="message">{message}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default Tamapet;
