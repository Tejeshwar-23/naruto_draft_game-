import './RoleBadge.css';

export default function RoleBadge({ role }) {
  const { id, name, icon, tagline, description } = role;

  return (
    <div className={`role-badge-item role-${id}`} title={`${name}: ${description}`}>
      <div className="role-icon-box">
        <span className="role-icon">{icon}</span>
      </div>
      <div className="role-text-box">
        <span className="role-name">{name}</span>
        <span className="role-tagline">{tagline}</span>
      </div>
    </div>
  );
}
