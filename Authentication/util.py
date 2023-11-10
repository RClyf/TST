from jose import jwt

SECRET_KEY = "ayokebali-TST"
ALGORITHM = "HS256"
USER_ID = "12345"

# Membuat token
token_data = {"sub": USER_ID}
token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

print("JWT Token:", token)