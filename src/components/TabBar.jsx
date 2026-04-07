import weatherTabsImage from "../assests/weather tabs.png";

const tabs = [
  { label: "Home", symbol: "⌂" },
  { label: "Radar", symbol: "◔" },
  { label: "Add", symbol: "+" },
  { label: "Alerts", symbol: "◉" },
  { label: "Profile", symbol: "☻" }
];

function TabBar() {
  return (
    <nav className="tab-bar" aria-label="Bottom Navigation">
      <img className="tab-bar__art" src={weatherTabsImage} alt="" aria-hidden="true" />
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`tab-bar__item ${tab.label === "Add" ? "is-active" : ""}`}
          type="button"
          aria-label={tab.label}
        >
          <span className="tab-bar__symbol">{tab.symbol}</span>
        </button>
      ))}
    </nav>
  );
}

export default TabBar;
