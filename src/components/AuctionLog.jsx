import './AuctionLog.css';

export default function AuctionLog({ activityLogs = [], cpuStatus = null }) {
  return (
    <div className="auction-activity-card" role="region" aria-label="Live Auction Log">
      <div className="activity-card-header">
        <div className="activity-header-left">
          <span className="activity-icon">📜</span>
          <span className="activity-title">AUCTION LOG</span>
        </div>
        {cpuStatus && (
          <span className="cpu-thinking-badge">
            <span className="cpu-pulse-dot"></span> {cpuStatus}
          </span>
        )}
      </div>

      <div className="activity-log-list" tabIndex={0} aria-live="polite">
        {activityLogs.length === 0 ? (
          <span className="activity-empty-text">Awaiting draft activity...</span>
        ) : (
          activityLogs.map((log) => (
            <div key={log.id} className={`activity-log-item log-type-${log.type}`}>
              {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
