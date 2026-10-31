# Análisis del registro de la demo · phonic-1-voz

Fuente: https://phonic.ai/demo, consultada el 2026-10-31. Se abrió el detalle de las 84 filas con herramientas en el navegador de la app. Los recuentos son propios; hay que repetirlos antes de la PUERTA 2.

## Recuento
- La columna «Tools» suma **123**, la cifra que da Phonic.
- 114 son webhooks. Los 114 van a `api.example.com` y devuelven 200.
- 8 son `choose_not_to_respond`.
- 1 es `natural_conversation_ending`.
- Mediana de la herramienta: 116 ms. Máximo: 64.386 ms (`call_restaurant`).
- Latencia del agente en 185 turnos: mediana 579 ms, mínimo 293 ms, máximo 2.823 ms.

## Herramientas en turnos de la clienta
14 de 123 aparecen en filas de Sofia:

| Fila | Herramienta |
|---|---|
| 00:34 | `search_rooms` |
| 02:43 | `update_guest_record`, `add_guest_details` |
| 05:13 | `get_flight` |
| 05:56 | `add_guest_details` |
| 06:39 | `add_guest_details` |
| 09:11 | `get_flight` |
| 16:04 | `book_table` |
| 17:30 | `find_tables` |
| 18:00, 18:12, 18:30 | `call_restaurant` |
| 21:17 | `find_tables` |
| 23:43 | `get_weather` |

El guion dice «unas once» porque excluye las tres `call_restaurant`. Duran de 38 a 64 s y su fila parece marcar cuándo terminan, no cuándo empiezan.

**Límite:** el registro asigna cada herramienta a una fila, pero no da su segundo exacto. Que una fila sea de Sofia no demuestra por sí solo que ella siguiera hablando. Apoyan esa lectura la marca de Phonic «21:15 Tool call while listening» y que la petición de 21:17 no recoge «walkable», lo último que dice la clienta.

## La reserva RT-4842
- **16:04, fila de Sofia:** `book_table` para Tia Rosa, 2026-12-10, 20:30, 7 personas. Respuesta: `status: confirmed`, código `RT-4842`.
- **16:15, fila del agente:** `find_tables` indica que Tia Rosa no tiene las 20:30 (`requested_time_available: false`). El agente dice a Sofia que no hay sitio a esa hora.
- **19:15 en adelante:** el restaurante queda descartado por la alergia y se reserva Casa Ondina (`RT-3593`, 20:10).
- **Comprobación:** se buscaron «4842», «cancel», «release» y «Tia Rosa» en el texto de las 84 filas. `RT-4842` solo aparece a las 16:04, y entre las 21 herramientas usadas no hay ninguna de cancelación.

**Lo que no se sabe:** si el simulador o el equipo de Phonic lo corrigen fuera del registro público, y por qué el simulador confirma una mesa que luego da como no disponible. Phonic no lo ha comentado.

## Otros hallazgos
- **Tara y Sarah:** a las 08:09 `add_guest_details` guarda «Sarah Quinn». A las 08:37 otra nota dice «Tara Quinn».
- **Teléfonos:** los tres que se dictan usan 555-01xx, la numeración reservada para ficción.
- **Cambio de idioma:** en la transcripción cambia cuando Sofia lo pide, no por iniciativa propia a mitad de frase, como sugiere el tweet.
- **Sofia:** Phonic no dice si es una persona real, una actriz o una simulación. Hasta saberlo, su voz no sale en los clips.
