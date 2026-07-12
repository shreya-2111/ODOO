from app.services.security import hash_password, verify_password

plain = "Shreya#2111"
hashed = hash_password(plain)
print("Hashed:", hashed)
is_valid = verify_password(plain, hashed)
print("Verify result:", is_valid)

# sujal
