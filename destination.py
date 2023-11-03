from fastapi import FastAPI, HTTPException
import json
from pydantic import BaseModel


class DestinationRequest(BaseModel):
    id: int
    name: str
    category: str
    duration: float

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

@app.post('/destination')
async def add_destination(dest: DestinationRequest):
	dest_dict = dest.dict()
	dest_found = False
	for destination_dest in data['destination']:
		if destination_dest['id'] == dest_dict['id']:
			dest_found = True
			return "Destination ID "+str(dest_dict['id'])+" exists."
	
	if not dest_found:
		data['destination'].append(dest_dict)
		with open(json_filename,"w") as write_file:
			json.dump(data, write_file)

		return dest_dict
	raise HTTPException(
		status_code=404, detail=f'Destination not found'
	)

@app.put('/destination')
async def update_destination(dest: DestinationRequest):
	dest_dict = dest.dict()
	dest_found = False
	for destination_idx, destination_dest in enumerate(data['destination']):
		if destination_dest['id'] == dest_dict['id']:
			dest_found = True
			data['destination'][destination_idx]=dest_dict
			
			with open(json_filename,"w") as write_file:
				json.dump(data, write_file)
			return "updated"
	
	if not dest_found:
		return "Destination ID not found."
	raise HTTPException(
		status_code=404, detail=f'Destination not found'
	)
 
@app.delete('/destination/{destination_id}')
async def delete_destination(destination_id: int):

	dest_found = False
	for destination_idx, destination_dest in enumerate(data['destination']):
		if destination_dest['id'] == destination_id:
			dest_found = True
			data['destination'].pop(destination_idx)
			
			with open(json_filename,"w") as write_file:
				json.dump(data, write_file)
			return "deleted"
	
	if not dest_found:
		return "Destination ID not found."
	raise HTTPException(
		status_code=404, detail=f'Destination not found'
	)