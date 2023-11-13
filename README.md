# TST
Routing API Ayo Ke Bali:

/register (POST) → mendaftar pengguna baru dengan format “user_id” dan “password”. “Password” akan di-hash terlebih dahulu dengan metode bcrypt

/signin (POST) → melakukan sign in dengan format user_id dan password yang akan menghasilkan return berupa access token

/destination (GET) → mendapatkan seluruh list data destinasi yang ada

/destination (POST) → menambahkan destinasi baru dengan field “id”, “name”, “category”, dan “location”

/destination (PUT) → meng-update data destinasi sesuai field “id”

/destination/{destination_id} (GET) → mendapatkan data destinasi sesuai dengan field “id”

/destination/{destination_id}  (DELETE) → menghapus data destinasi sesuai dengan field “id”

/destination/name/{name} (GET) → mendapatkan data destinasi yang mengandung atau sama dengan field “name” berdasarkan dengan input “name” dari pengguna

/destination/category/{category} (GET) → mendapatkan data destinasi yang mengandung atau sama dengan field “category” berdasarkan dengan input “category” dari pengguna

/destination/location/{location} (GET) → mendapatkan data destinasi yang mengandung atau sama dengan field “location” berdasarkan dengan input “location” dari pengguna

/itinerary (GET) → mendapatkan seluruh list data itinerary yang ada

/itinerary (POST) → menambahkan itinerary baru dengan field “id”, “user_id”, “start_date”, “end_date”, “accomodation”, dan “destination”

/itinerary (PUT) → meng-update data itinerary sesuai field “id”

/itinerary/{itinerary_id} (GET) → mendapatkan data itinerary sesuai dengan field “id”

/itinerary/{itinerary_id} (DELETE) → menghapus data itinerary sesuai dengan field “id”

/itinerary/user/{user_id} (GET) → mendapatkan data itinerary sesuai dengan field “user_id”
