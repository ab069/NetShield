import random
from collections import defaultdict
from datetime import datetime, timezone

# Simulated state tracking for detection logic
_port_scan_tracker: dict[str, set[int]] = defaultdict(set)
_brute_force_tracker: dict[str, int] = defaultdict(int)


def analyze_packet(
    src_ip: str,
    dst_ip: str,
    protocol: str,
    port: int,
    bytes_sent: int,
    duration: float,
) -> dict | None:
    alerts = []

    port_scan_alert = _detect_port_scan(src_ip, dst_ip, port, protocol)
    if port_scan_alert:
        alerts.append(port_scan_alert)

    ddos_alert = _detect_ddos(src_ip, dst_ip, bytes_sent, protocol)
    if ddos_alert:
        alerts.append(ddos_alert)

    bf_alert = _detect_brute_force(src_ip, dst_ip, duration, protocol, port)
    if bf_alert:
        alerts.append(bf_alert)

    arp_alert = _detect_arp_spoofing(protocol, src_ip, dst_ip)
    if arp_alert:
        alerts.append(arp_alert)

    dns_alert = _detect_dns_tunnel(protocol, port, bytes_sent, dst_ip)
    if dns_alert:
        alerts.append(dns_alert)

    if alerts:
        result = alerts[0]
        result["details"] = {"all_detections": alerts, "analyzed_at": datetime.now(timezone.utc).isoformat()}
        result["threat_score"] = calculate_threat_score(result["alert_type"], result["severity"])
        return result

    return None


def _detect_port_scan(src_ip: str, dst_ip: str, port: int, protocol: str) -> dict | None:
    key = f"{src_ip}->{dst_ip}"
    _port_scan_tracker[key].add(port)
    if len(_port_scan_tracker[key]) >= 5:
        return {
            "alert_type": "port_scan",
            "title": f"Port scan detected from {src_ip}",
            "description": f"Multiple ports scanned on {dst_ip} including port {port}",
            "source_ip": src_ip,
            "dest_ip": dst_ip,
            "protocol": protocol,
            "severity": "high",
            "details": {"ports_scanned": list(_port_scan_tracker[key])},
        }
    return None


def _detect_ddos(src_ip: str, dst_ip: str, bytes_sent: int, protocol: str) -> dict | None:
    if bytes_sent > 100000:
        return {
            "alert_type": "ddos",
            "title": f"Possible DDoS from {src_ip}",
            "description": f"High volume traffic: {bytes_sent} bytes sent to {dst_ip}",
            "source_ip": src_ip,
            "dest_ip": dst_ip,
            "protocol": protocol,
            "severity": "critical",
            "details": {"bytes_sent": bytes_sent},
        }
    return None


def _detect_brute_force(src_ip: str, dst_ip: str, duration: float, protocol: str, port: int) -> dict | None:
    if duration < 0.5 and port in (22, 3389, 21):
        key = f"{src_ip}->{dst_ip}:{port}"
        _brute_force_tracker[key] += 1
        if _brute_force_tracker[key] >= 3:
            return {
                "alert_type": "brute_force",
                "title": f"Brute force attempt from {src_ip}",
                "description": f"Rapid connections on port {port} to {dst_ip}",
                "source_ip": src_ip,
                "dest_ip": dst_ip,
                "protocol": protocol,
                "severity": "critical",
                "details": {"port": port, "attempts": _brute_force_tracker[key]},
            }
    return None


def _detect_arp_spoofing(protocol: str, src_ip: str, dst_ip: str) -> dict | None:
    if protocol == "ARP":
        return {
            "alert_type": "arp_spoofing",
            "title": f"ARP spoofing detected",
            "description": f"Suspicious ARP activity between {src_ip} and {dst_ip}",
            "source_ip": src_ip,
            "dest_ip": dst_ip,
            "protocol": "ARP",
            "severity": "high",
            "details": {"arp_type": "reply"},
        }
    return None


def _detect_dns_tunnel(protocol: str, port: int, bytes_sent: int, dst_ip: str) -> dict | None:
    if protocol == "DNS" and bytes_sent > 500:
        return {
            "alert_type": "dns_tunnel",
            "title": f"DNS tunneling suspected",
            "description": f"Large DNS payload ({bytes_sent} bytes) to {dst_ip}",
            "source_ip": "",
            "dest_ip": dst_ip,
            "protocol": "DNS",
            "severity": "medium",
            "details": {"payload_size": bytes_sent, "port": port},
        }
    return None


def calculate_threat_score(alert_type: str, severity: str) -> int:
    base_scores = {
        "port_scan": 40,
        "ddos": 90,
        "brute_force": 85,
        "arp_spoofing": 60,
        "dns_tunnel": 50,
    }
    severity_mod = {"critical": 1.0, "high": 0.8, "medium": 0.5, "low": 0.3}
    base = base_scores.get(alert_type, 30)
    mod = severity_mod.get(severity, 0.5)
    score = int(base * mod) + random.randint(0, 10)
    return min(score, 100)


def extract_iocs(alert: dict) -> dict:
    iocs = {"ips": [], "protocols": [], "types": []}
    if alert.get("source_ip"):
        iocs["ips"].append(alert["source_ip"])
    if alert.get("dest_ip"):
        iocs["ips"].append(alert["dest_ip"])
    if alert.get("protocol"):
        iocs["protocols"].append(alert["protocol"])
    if alert.get("alert_type"):
        iocs["types"].append(alert["alert_type"])
    iocs["ips"] = list(set(iocs["ips"]))
    iocs["protocols"] = list(set(iocs["protocols"]))
    return iocs


def generate_report(alerts: list[dict]) -> str:
    if not alerts:
        return "No alerts to report."
    total = len(alerts)
    severities = defaultdict(int)
    types = defaultdict(int)
    for a in alerts:
        severities[a.get("severity", "unknown")] += 1
        types[a.get("alert_type", "unknown")] += 1
    lines = [
        "=" * 50,
        "NETSHIELD IDS INCIDENT REPORT",
        "=" * 50,
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        f"Total Alerts: {total}",
        "",
        "--- Severity Breakdown ---",
    ]
    for sev, count in sorted(severities.items()):
        lines.append(f"  {sev}: {count}")
    lines.append("")
    lines.append("--- Alert Type Breakdown ---")
    for at, count in sorted(types.items()):
        lines.append(f"  {at}: {count}")
    lines.append("")
    lines.append("--- Alert Details ---")
    for i, a in enumerate(alerts, 1):
        lines.append(f"  {i}. [{a.get('severity','').upper()}] {a.get('title','')}")
        lines.append(f"     Type: {a.get('alert_type','')} | Score: {a.get('threat_score','N/A')}")
    lines.append("=" * 50)
    return "\n".join(lines)
