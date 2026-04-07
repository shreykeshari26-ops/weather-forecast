function WeatherDetailCard({ icon, label, value, note }) {
  return (
    <article className="detail-card">
      <div className="detail-card__icon">{icon}</div>
      <p className="detail-card__label">{label}</p>
      <p className="detail-card__value">{value}</p>
      <p className="detail-card__note">{note}</p>
    </article>
  );
}

export default WeatherDetailCard;
