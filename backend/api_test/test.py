#!/usr/bin/env python
import json

import asyncio
import time
from websockets.asyncio.client import connect

URL = "ws://127.0.0.1:8080/ws"

PURPLE = "\033[95m"
BLUE = "\033[94m"
CYAN = "\033[96m"
GREEN = "\033[92m"
GRAY = "\033[90m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"
UNDERLINE = "\033[4m"
ITALICS = "\033[3m"


async def host_game(ws):
    await ws.send(json.dumps({"action": "host_room"}))
    message = await ws.recv()
    room = json.loads(message)
    return room


async def join_room(ws, room, player_name):
    await ws.send(
        json.dumps(
            {
                "action": "join_room",
                "room": room["room"],
                "name": player_name,
            }
        )
    )
    message = await ws.recv()
    room = json.loads(message)
    return room


async def register_buzzer(ws, room, player_id: str, team: int):
    await ws.send(json.dumps({"action": "registerbuzz", "room": room["room"], "team": team, "id": player_id}))


async def find_player_id(room, player_name) -> str:
    registered_players = room["game"]["registeredPlayers"]
    for player_id, player in registered_players.items():
        if player["name"] == player_name:
            return player_id
    raise Exception(f"{player_name} not found in {room['room']}")


async def test_host_game():
    async with connect(URL) as ws:
        room = await host_game(ws)
        print(room)
        print(GREEN, "test_host_game ✅", RESET)


async def test_join_game():
    player_1 = "Player 1"
    player_2 = "Player 2"
    async with connect(URL) as ws:
        room = await host_game(ws)
        room = await join_room(ws, room, player_1)
        room = await join_room(ws, room, player_2)
        player_1_id = await find_player_id(room, player_1)
        player_2_id = await find_player_id(room, player_2)
        print(room)
        print(player_1, player_1_id)
        print(player_2, player_2_id)
        print(GREEN, "test_join_game ✅", RESET)


async def test_register_buzzer():
    player_1 = "Player 1"
    player_2 = "Player 2"
    team_1 = 0
    team_2 = 0
    async with connect(URL) as ws:
        room = await host_game(ws)
    async with connect(URL) as ws:
        room = await join_room(ws, room, player_1)
    async with connect(URL) as ws:
        room = await join_room(ws, room, player_2)
        player_1_id = await find_player_id(room, player_1)
        player_2_id = await find_player_id(room, player_2)
        print(room)
        print(player_1, player_1_id)
        print(player_2, player_2_id)
        await register_buzzer(ws, room, player_1_id, team_1)
        await register_buzzer(ws, room, player_2_id, team_2)
        print(room)
        print(GREEN, "test_register_buzzer", RESET)


async def main():
    await test_host_game()
    await test_join_game()
    await test_register_buzzer()


if __name__ == "__main__":
    asyncio.run(main())
