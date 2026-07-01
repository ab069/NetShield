from app.agents.ids_engine import (
    analyze_packet,
    calculate_threat_score,
    extract_iocs,
    generate_report,
)


def test_port_scan_detection():
    for port in [22, 80, 443, 8080, 3306, 5432]:
        result = analyze_packet("10.0.0.1", "192.168.1.1", "TCP", port, 1000, 1.0)
    assert result is not None
    assert result["alert_type"] == "port_scan"
    assert result["severity"] == "high"


def test_ddos_detection():
    result = analyze_packet("10.0.0.1", "192.168.1.1", "TCP", 80, 200000, 5.0)
    assert result is not None
    assert result["alert_type"] == "ddos"
    assert result["severity"] == "critical"


def test_brute_force_detection():
    for _ in range(3):
        result = analyze_packet("10.0.0.1", "192.168.1.1", "TCP", 22, 500, 0.2)
    assert result is not None
    assert result["alert_type"] == "brute_force"


def test_arp_spoofing_detection():
    result = analyze_packet("10.0.0.1", "192.168.1.1", "ARP", 0, 100, 0.1)
    assert result is not None
    assert result["alert_type"] == "arp_spoofing"


def test_dns_tunnel_detection():
    result = analyze_packet("10.0.0.1", "192.168.1.1", "DNS", 53, 1000, 1.0)
    assert result is not None
    assert result["alert_type"] == "dns_tunnel"


def test_calculate_threat_score():
    score = calculate_threat_score("ddos", "critical")
    assert 0 <= score <= 100
    assert score >= 80


def test_extract_iocs():
    alert = {
        "source_ip": "10.0.0.1",
        "dest_ip": "192.168.1.1",
        "protocol": "TCP",
        "alert_type": "port_scan",
    }
    iocs = extract_iocs(alert)
    assert "10.0.0.1" in iocs["ips"]
    assert "192.168.1.1" in iocs["ips"]
    assert "TCP" in iocs["protocols"]


def test_generate_report():
    alerts = [
        {"severity": "critical", "title": "DDoS detected", "alert_type": "ddos", "threat_score": 95},
        {"severity": "high", "title": "Port scan detected", "alert_type": "port_scan", "threat_score": 65},
    ]
    report = generate_report(alerts)
    assert "NETSHIELD IDS INCIDENT REPORT" in report
    assert "DDoS detected" in report
    assert "Port scan detected" in report
