from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
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

# JWT token authentication
ADMIN = "Admin123"
SECRET_KEY = "ayokebali-TST"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return user_id

app = FastAPI()

@app.get('/token/{user_id}')
async def return_token(user_id: str):
    token_data = {"sub": user_id}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token}

@app.get('/destination', dependencies=[Depends(get_current_user)])
async def read_all_destination():
	return data['destination']

@app.get('/destination/{destination_id}', dependencies=[Depends(get_current_user)])
async def read_destination(destination_id: int,):
	for destination_item in data['destination']:
		print(destination_item)
		if destination_item['destination_id'] == destination_id:
			return destination_item
	raise HTTPException(
		status_code=404, detail=f'Destination not found'
	)

@app.get('/destination/name/{name}', dependencies=[Depends(get_current_user)])
async def read_destination_name(name: str):
	matching_destinations = [destination_item for destination_item in data['destination'] if name.lower() in destination_item['name'].lower()]
	if matching_destinations:
		return matching_destinations
	raise HTTPException(
		status_code=404, detail=f'Destination not found'
	)

@app.get('/destination/category/{category}', dependencies=[Depends(get_current_user)])
async def read_destination_category(category: str):
	matching_destinations = [destination_item for destination_item in data['destination'] if destination_item['category'] == category]
	if matching_destinations:
		return matching_destinations
	raise HTTPException(
		status_code=404, detail=f'Category not found'
	)

@app.get('/destination/location/{location}', dependencies=[Depends(get_current_user)])
async def read_destination_location(location: str):
	matching_destinations = [destination_item for destination_item in data['destination'] if destination_item['location'] == location]
	if matching_destinations:
		return matching_destinations
	raise HTTPException(
		status_code=404, detail=f'Location not found'
	)

@app.post('/destination')
async def add_destination(dest: Destination, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
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
async def update_destination(dest: Destination, current_user: str = Depends(get_current_user)):
    if ADMIN != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maaf Anda bukan Admin",
        )
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
async def delete_destination(destination_id: int, current_user: str = Depends(get_current_user)):
	if ADMIN != current_user:
		raise HTTPException(
			status_code=status.HTTP_403_FORBIDDEN,
			detail="Maaf Anda bukan Admin",
		)
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

@app.get('/itinerary', dependencies=[Depends(get_current_user)])
async def read_all_itinerary():
    return data1['itinerary']

@app.get('/itinerary/{itinerary_id}')
async def read_itinerary(itinerary_id: int, current_user: str = Depends(get_current_user)):
    for itinerary_item in data1['itinerary']:
        if itinerary_item['id'] == itinerary_id:
            if itinerary_item['user_id'] != current_user:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Itinerary ini bukan milik Anda",
                )
            return itinerary_item
    raise HTTPException(
    status_code=404, detail=f'Itinerary not found'
    )
        
@app.get('/itinerary/user/{user_id}')
async def read_itinerary(user_id: str, current_user: str = Depends(get_current_user)):
    if user_id != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Itinerary ini bukan milik Anda",
        )
    matching_users_itinerary = [itinerary_item for itinerary_item in data1['itinerary'] if itinerary_item['user_id'] == user_id]
    if matching_users_itinerary:
        return matching_users_itinerary
    raise HTTPException(
        status_code=404, detail=f'Itinerary not found'
    )
	

@app.post('/itinerary')
async def create_itinerary(itinerary: Itinerary,current_user: str = Depends(get_current_user)):
    itinerary_dict = itinerary.dict()
    if itinerary_dict['user_id'] != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid User ID",
        )
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
async def update_itinerary(itinerary: Itinerary, current_user: str = Depends(get_current_user)):
    itinerary_dict = itinerary.dict()
    if itinerary_dict['user_id'] != current_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Itinerary ini bukan milik Anda",
        )
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
async def delete_itinerary(itinerary_id: int,current_user: str = Depends(get_current_user)):
	itinerary_found = False
	for itinerary_idx, itinerary_item in enumerate(data1['itinerary']):
		if itinerary_item['id'] == itinerary_id:
			itinerary_found = True
			if itinerary_item['user_id'] != current_user:
				raise HTTPException(
					status_code=status.HTTP_403_FORBIDDEN,
					detail="Itinerary ini bukan milik Anda",
				)
			data1['itinerary'].pop(itinerary_idx)
			
			with open(json_filename1,"w") as write_file:
				json.dump(data1, write_file)
			return "deleted"
	
	if not itinerary_found:
		return "Itinerary ID not found."
	raise HTTPException(
		status_code=404, detail=f'Itinerary not found'
	)
