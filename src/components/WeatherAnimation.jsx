import React from "react";
import "./weatherAnimation.css";

function WeatherAnimation({ condition }) {

  const getAnimation = () => {
    switch (condition) {

      case "Clear":
        return <div className="sun"></div>;

      case "Clouds":
        return <div className="cloud"></div>;

      case "Rain":
        return <div className="rain-container"></div>;

      case "Thunderstorm":
        return <div className="thunder">⚡</div>;

      default:
        return <div className="cloud"></div>;
    }
  };

  return (
    <div className="weather-animation">
      {getAnimation()}
    </div>
  );
}

export default WeatherAnimation;