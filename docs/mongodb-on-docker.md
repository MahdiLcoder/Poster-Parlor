## 1️⃣ Pull MongoDB Image

```bash
docker pull mongo:7
```

---

## 2️⃣ Run MongoDB Container (Single Command)

```bash
docker run -d ^
  --name poster-parlor-mongo ^
  -p 27017:27017 ^
  -e MONGO_INITDB_ROOT_USERNAME=admin ^
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 ^
  -v mongo_data:/data/db ^
  mongo:7
```

✅ What this does:

- Runs MongoDB in background
- Exposes MongoDB on `localhost:27017`
- Creates **admin user**
- Persists data using Docker volume

---

## 3️⃣ Verify MongoDB is Running

```bash
docker ps
```

---

## 4️⃣ Connect MongoDB Compass (GUI)

### Connection String

```
mongodb://admin:admin123@localhost:27017
```

### Compass Settings

- Authentication: **Username / Password**
- Auth DB: **admin**

✅ Click **Connect**

---

## 5️⃣ Connect MongoDB to Node.js App (Local Node)

### `.env`

```env
MONGO_URI=mongodb://admin:admin123@localhost:27017/poster_parlor
```

---

### `db.js`

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error", err);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 6️⃣ If Node App Is ALSO Running in Docker (Important 🔥)

### ❌ This will NOT work

```
mongodb://admin:admin123@localhost:27017
```

### ✅ Use Container Name

```
mongodb://admin:admin123@poster-parlor-mongo:27017/poster_parlor
```

Docker automatically creates an internal network.

---

## 7️⃣ Optional: Access Mongo Shell Inside Container

```bash
docker exec -it poster-parlor-mongo mongosh -u admin -p admin123
```

---

## 8️⃣ Stop / Remove MongoDB

```bash
docker stop poster-parlor-mongo
docker start poster-parlor-mongo
```

### ⚠ Remove Completely (Data lost)

```bash
docker rm -f poster-parlor-mongo
docker volume rm mongo_data
```

---

## 9️⃣ Common Errors & Fixes

### ❌ `MongoServerSelectionError`

✔ Mongo container not running
✔ Wrong credentials
✔ Port already used

---

### ❌ Compass not connecting

✔ Auth DB = `admin`
✔ Use `localhost` (not container name)

---

## ✅ Final Setup Summary

```
MongoDB → Docker Container
Compass → Local App → localhost:27017
Node.js → localhost:27017 (or container name if Dockerized)
```
