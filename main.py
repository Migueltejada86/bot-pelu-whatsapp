from fastapi import FastAPI, Request, Form
from fastapi.responses import Response
from twilio.twiml.messaging_response import MessagingResponse
import os

app = FastAPI()

# Estado en memoria. Se borra si reinicia Railway. Para prod usá DB.
user_state = {}

@app.get("/")
def root():
    return {"status": "ok", "bot": "Angelito del Fuego"}

@app.post("/webhook")
async def whatsapp_webhook(From: str = Form(...), Body: str = Form(...)):
    print(f"[WA] De: {From} | Msg: {Body}") # Esto lo ves en Railway Logs

    resp = MessagingResponse()
    msg = Body.strip().lower()

    state = user_state.get(From, {"paso": "inicio"})

    if msg == "hola" or state["paso"] == "inicio":
        user_state[From] = {"paso": "menu"}
        resp.message(
            "Hola 👋 Soy Angelito del Fuego\n"
            "Elegí una opción:\n"
            "1. ✂️ Corte\n"
            "2. 🎨 Color\n"
            "3. 📅 Ver mis turnos"
        )
    elif state["paso"] == "menu":
        if msg == "1":
            user_state[From] = {"paso": "inicio"} # Reseteamos
            resp.message("Perfecto, elegiste Corte ✂️\n¿Para qué día querés turno?")
        elif msg == "2":
            user_state[From] = {"paso": "inicio"}
            resp.message("Genial, Color 🎨\n¿Teñido completo o mechas?")
        elif msg == "3":
            user_state[From] = {"paso": "inicio"}
            resp.message("Todavía no tengo turnos cargados para vos 📅")
        else:
            resp.message('No te entendí. Mandá 1, 2 o 3.')
    else:
        user_state[From] = {"paso": "inicio"}
        resp.message('Mandá "hola" para empezar 👋')

    return Response(content=str(resp), media_type="application/xml") # <- Esta es la clave