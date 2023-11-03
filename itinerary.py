from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import List, Optional

class Destination(BaseModel):
    destination_id: int
    name: str
    category: str
    location: str

class Itinerary(BaseModel):
    id: int
    user_id: str
    start_date: str
    end_date: str
    accommodation: str
    destination: List[Destination]

json_filename="destination.json"

with open(json_filename,"r") as read_file:
	data = json.load(read_file)

json_filename1="itinerary.json"

with open(json_filename1,"r") as read_file:
	data1 = json.load(read_file)



app = FastAPI()

@app.get('/destination')
async def read_all_destination():
	return data['destination']

@app.get('/destination/{destination_id}')
async def read_destination(destination_id: int):
	for destination_item in data['destination']:
		print(destination_item)
		if destination_item['destination_id'] == destination_id:
			return destination_item
	raise HTTPException(
		status_code=404, detail=f'destination not found'
	)

@app.post('/destination')
async def add_destination(dest: Destination):
	dest_dict = dest.dict()
	dest_found = False
	for destination_dest in data['destination']:
		if destination_dest['destination_id'] == dest_dict['destination_id']:
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
async def update_destination(dest: Destination):
	dest_dict = dest.dict()
	dest_found = False
	for destination_idx, destination_dest in enumerate(data['destination']):
		if destination_dest['destination_id'] == dest_dict['destination_id']:
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
		if destination_dest['destination_id'] == destination_id:
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

@app.get('/itinerary')
async def read_all_itinerary():
	return data1['itinerary']

@app.get('/itinerary/{itinerary_id}')
async def read_itinerary(itinerary_id: int):
    for itinerary_item in data1['itinerary']:
        if itinerary_item['id'] == itinerary_id:
            return itinerary_item
    raise HTTPException(
    status_code=404, detail=f'Itinerary not found'
	)
        
@app.get('/itinerary/user/{user_id}')
async def read_itinerary(user_id: str):
    for itinerary_item in data1['itinerary']:
        if itinerary_item['user_id'] == user_id:
            return itinerary_item
    raise HTTPException(
    status_code=404, detail=f'Itinerary not found'
	)

@app.post('/itinerary')
async def create_itinerary(itinerary: Itinerary):
    itinerary_dict = itinerary.dict()
    itinerary_found = False
    for itinerary_item in data1['itinerary']:
        if itinerary_item['id'] == itinerary_dict['id']:
            itinerary_found = True
            return "Itinerary ID "+str(itinerary_dict['id'])+" exists."
	
    if not itinerary_found:
        data1['itinerary'].append(itinerary_dict)
        with open(json_filename1,"w") as write_file:
            json.dump(data1, write_file)

        return itinerary_dict
    raise HTTPException(
		status_code=404, detail=f'Itinerary not found'
	)

@app.put('/itinerary')
async def update_itinerary(itinerary: Itinerary):
    itinerary_dict = itinerary.dict()
    itinerary_found = False
    for itinerary_idx, itinerary_item in enumerate(data1['itinerary']):
        if itinerary_item['id'] == itinerary_dict['id']:
            itinerary_found = True
            data1['itinerary'][itinerary_idx]=itinerary_dict
			
            with open(json_filename1,"w") as write_file:
                json.dump(data1, write_file)
            return "updated"
	
    if not itinerary_found:
        return "Itinerary ID not found."
    raise HTTPException(
		status_code=404, detail=f'Itinerary not found'
	)

@app.delete('/itinerary/{itinerary_id}')
async def delete_itinerary(itinerary_id: int):
	itinerary_found = False
	for itinerary_idx, itinerary_item in enumerate(data1['itinerary']):
		if itinerary_item['id'] == itinerary_id:
			itinerary_found = True
			data1['itinerary'].pop(itinerary_idx)
			
			with open(json_filename1,"w") as write_file:
				json.dump(data1, write_file)
			return "deleted"
	
	if not itinerary_found:
		return "Itinerary ID not found."
	raise HTTPException(
		status_code=404, detail=f'Itinerary not found'
	)
