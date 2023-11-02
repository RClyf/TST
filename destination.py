from fastapi import FastAPI, HTTPException
import json
from pydantic import BaseModel


class DestinationRequest(BaseModel):
    id: str
    name: str
    duration: int
    category: str

json_filename="destination.json"

with open(json_filename,"r") as read_file:
	data = json.load(read_file)

app = FastAPI()

@app.get('/destination')
async def read_all_destination():
	return data['destination']

@app.get('/destination/{destination_id}')
async def read_destination(destination_id: int):
	for destination_item in data['destination']:
		print(destination_item)
		if destination_item['id'] == destination_id:
			return destination_item
	raise HTTPException(
		status_code=404, detail=f'destination not found'
	)

