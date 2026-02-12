import requests
import time
import json
import random

API_URL = "http://localhost:8090/api/mcp/dispatch"

def send_command(command_type, payload):
    data = {
        "type": command_type,
        "payload": payload,
        "timestamp": int(time.time() * 1000)
    }
    
    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            print(f"✅ [Brain] Sent {command_type}: Success")
        else:
            print(f"❌ [Brain] Sent {command_type}: Failed ({response.status_code})")
    except Exception as e:
         print(f"⚠️ [Brain] Connection Error: {e}")

def scenario_cyberpunk():
    print("\n🚀 Starting Scenario: Cyberpunk Alley (Night City)...")
    
    # 1. Create World
    send_command("create_world", {
        "id": "cp_001",
        "theme": "cyberpunk",
        "atmosphere": "Neon Rain",
        "narrative_intro": "비가 내리는 네오 서울의 뒷골목. 네온 사인이 젖은 바닥에 반사된다."
    })
    time.sleep(2)

    # 2. Spawn Actors
    actors = [
        {"id": "hero", "name": "Cyborg Noir", "type": "static_mesh", "pos": [0, 0, 0]},
        {"id": "prop_trash", "name": "Dumpster", "type": "static_mesh", "pos": [2, 0, 2]},
        {"id": "light_neon", "name": "Neon Sign", "type": "light", "pos": [0, 5, 0]},
    ]
    
    for actor in actors:
        send_command("spawn_actor", {
            "id": actor["id"],
            "name": actor["name"],
            "type": actor["type"],
            "description": "A dark, gritty asset.",
            "position": actor["pos"]
        })
        time.sleep(0.5)

def scenario_fantasy():
    print("\n⚔️ Starting Scenario: Enchanted Forest...")
    
    send_command("create_world", {
        "id": "fantasy_001",
        "theme": "fantasy",
        "atmosphere": "Mystic Fog",
        "narrative_intro": "안개가 자욱한 고대 숲. 요정의 불빛이 희미하게 빛난다."
    })
    time.sleep(2)
    
    send_command("spawn_actor", {
        "id": "tree_ancient",
        "name": "Giant Oak",
        "type": "static_mesh",
        "position": [0, 0, -5],
        "description": "A massive tree with glowing runes."
    })

def scenario_procedural_test():
    print("\n🧩 Starting Scenario: Procedural Layout Test...")
    
    # 1. Cyberpunk Grid Test
    print("   [1/2] Testing Cyberpunk Grid...")
    send_command("create_world", {
        "id": "proc_city",
        "theme": "cyberpunk",
        "atmosphere": "Neon Haze",
        "narrative_intro": "질서 정연한 미래 도시의 거리."
    })
    time.sleep(1)

    # Spawn 5 dumpsters without position -> Should grid align
    for i in range(5):
        send_command("spawn_actor", {
            "id": f"dumpster_{i}",
            "name": "Dumpster",
            "type": "static_mesh",
            # No position provided -> LayoutResolver should fix
            "description": "A trash container."
        })
        time.sleep(0.2)

    time.sleep(3)

    # 2. Horror Chaos Test
    print("   [2/2] Testing Horror Chaos...")
    send_command("create_world", {
        "id": "proc_horror",
        "theme": "horror",
        "atmosphere": "Dark Fog",
        "narrative_intro": "혼돈스러운 악몽의 공간."
    })
    time.sleep(1)

    # Spawn 5 chests without position -> Should scatter
    for i in range(5):
        send_command("spawn_actor", {
            "id": f"chest_{i}",
            "name": "Cursed Chest",
            "type": "static_mesh",
            # No position
            "description": "A scary chest."
        })
        time.sleep(0.2)
    
    # Hero always at [0,0,2] (Layout default) or Explicit
    send_command("spawn_actor", {
        "id": "hero_test",
        "name": "Detective",
        "type": "static_mesh",
        "position": [0, 0, 0], # Explicit override
        "description": "The observer."
    })

def scenario_optimize_test():
    """
    Test Blender optimization tool via MCP.
    """
    print("\n--- Running Blender Optimization Test ---")
    
    # 1. Optimize Duck asset
    test_asset = "public/assets/models/Duck.glb"
    output_asset = "public/assets/models/Duck_opt_mcp.glb"
    
    print(f"Requesting optimization for: {test_asset}")
    
    # Call the MCP tool via the HTTP bridge
    # Note: The MCP server handles the 'optimize_asset' tool call
    # Here we simulate the brain sending the command to the queue/dispatcher
    # But since execute_tool returns result, we might want to check response.
    # However, our current bridge is fire-and-forget for 'dispatch'.
    # We need to send a tool execute request if we want the result back,
    # OR we just send the command and check the file creation.
    # Our system treats tool calls as commands.
    
    send_command("optimize_asset", {
        "input_path": test_asset,
        "output_path": output_asset,
        "ratio": 0.2
    })
    
    # Wait for processing (it's async)
    print("Waiting for optimization...")
    time.sleep(5) 

if __name__ == "__main__":
    print("🧠 initializing Mock Brain...")
    scenario_cyberpunk()
    # scenario_procedural_test()
    # scenario_optimize_test()
    print("✨ Simulation Complete.")
