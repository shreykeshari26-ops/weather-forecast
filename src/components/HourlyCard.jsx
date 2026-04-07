function HourlyCard({ time, icon, label, temperature }) {
  return (
    <article className="hourly-card">
      <p className="hourly-card__time">{time}</p>
      <div className="hourly-card__icon-wrap">
        <img className="hourly-card__icon" src={icon} alt={label} />
      </div>
      <p className="hourly-card__temp">{temperature}</p>
      <p className="hourly-card__label">{label}</p>
    </article>
  );
}

export default HourlyCard;
