import asyncio
import json
import random
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.agents.ids_engine import analyze_packet, calculate_threat_score

router = APIRouter()

connected_clients: set[WebSocket] = set()

PROTOCOLS = ["TCP", "UDP", "ICMP", "DNS", "HTTP", "HTTPS", "ARP"]
PORTS = [22, 80, 443, 8080, 3306, 5432, 3389, 53, 21, 6379]
IP_POOL = [
    "10.0.0.1", "10.0.0.2", "10.0.0.100", "172.16.0.50",
    "192.168.1.1", "192.168.1.100", "10.0.0.45", "172.16.0.200",
]


def _generate_packet():
    src = random.choice(IP_POOL)
    dst = random.choice([ip for ip in IP_POOL if ip != src])
    protocol = random.choice(PROTOCOLS)
    port = random.choice(PORTS)
    bytes_sent = random.randint(100, 500000)
    duration = round(random.uniform(0.1, 30.0), 2)
    return {
        "src_ip": src,
        "dst_ip": dst,
        "protocol": protocol,
        "port": port,
        "bytes_sent": bytes_sent,
        "duration": duration,
    }


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            if msg.get("action") == "analyze":
                packet = msg.get("packet", {})
                result = analyze_packet(
                    src_ip=packet.get("src_ip", ""),
                    dst_ip=packet.get("dst_ip", ""),
                    protocol=packet.get("protocol", "TCP"),
                    port=packet.get("port", 80),
                    bytes_sent=packet.get("bytes", 0),
                    duration=packet.get("duration", 0.0),
                )
                traffic_event = {
                    "type": "traffic",
                    "data": {
                        "src_ip": packet.get("src_ip", ""),
                        "dst_ip": packet.get("dst_ip", ""),
                        "protocol": packet.get("protocol", "TCP"),
                        "port": packet.get("port", 80),
                        "bytes": packet.get("bytes", 0),
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    },
                }
                await websocket.send_json(traffic_event)
                if result:
                    alert_event = {
                        "type": "alert",
                        "data": {
                            **result,
                            "threat_score": calculate_threat_score(result["alert_type"], result["severity"]),
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        },
                    }
                    await websocket.send_json(alert_event)
            elif msg.get("action") == "simulate":
                for _ in range(5):
                    packet = _generate_packet()
                    result = analyze_packet(**packet)
                    traffic_event = {
                        "type": "traffic",
                        "data": {**packet, "timestamp": datetime.now(timezone.utc).isoformat()},
                    }
                    await websocket.send_json(traffic_event)
                    if result:
                        alert_event = {
                            "type": "alert",
                            "data": {
                                **result,
                                "threat_score": calculate_threat_score(result["alert_type"], result["severity"]),
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                            },
                        }
                        await websocket.send_json(alert_event)
                    await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass
    finally:
        connected_clients.discard(websocket)
