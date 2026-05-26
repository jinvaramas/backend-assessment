**Loom Video**
https://www.loom.com/share/71f83f8dae3a42b784818d2ae8aeee85

**1. What does each HTTP method in your API mean — GET, POST, PUT or PATCH, and DELETE? Why do we use different methods instead of just using POST for everything?**

*answer:* แต่ละ method บอก server ว่าเราอยากทำอะไรกับข้อมูล เหมือนกับการบอก intent ก่อนทำอะไร
GET — แค่ขอดูข้อมูล ไม่แตะของอะไรเลย เช่น ดูรายการสินค้าทั้งหมด มีสองแบบจาก API ที่เขียนคือ
1. app.get("/products", ...) — ดึงสินค้าทั้งหมดออกมาจาก array products
2. app.get("/products/:id", ...) — ดึงสินค้าชิ้นเดียวโดยใช้ products.find()

#POST — ส่งข้อมูลใหม่ไปสร้างของใหม่ เช่น เพิ่มสินค้าใหม่เข้า array
app.post("/products", ...) — รับข้อมูลจาก req.body แล้ว products.push(newProduct) เพิ่มเข้า array

#PATCH — แก้ไขแค่บางส่วนของของที่มีอยู่แล้ว เช่น เปลี่ยนแค่ราคา โดยไม่ต้องส่งทุก field มาใหม่
app.patch("/products/:id", ...) — ใช้ spread operator { ...products[index], ...req.body } merge ข้อมูลเดิมกับที่ส่งมาใหม่ เช่น ส่งมาแค่ { price: 3999 } ก็แค่ราคาที่เปลี่ยน ชื่อและ quantity ยังเหมือนเดิม

#DELETE — ลบของออกไปเลย
app.delete("/products/:id", ...) — ใช้ products.splice(index, 1) ตัดสินค้าออกจาก array

#ทำไมไม่ใช้ POST อย่างเดียว?
เพราะ method คือการสื่อสาร intent — ถ้าเราเขียน app.post("/products/delete", ...) มันทำงานได้ แต่คนอื่นที่มาอ่านโค้ดหรือใช้ API ต้องไปอ่าน URL ถึงจะรู้ว่าลบ
แต่พอเห็น DELETE /products/1 — รู้ทันทีเลยว่าลบสินค้า id 1 โดยไม่ต้องอธิบายอะไรเพิ่ม

---

**2. What is `express.json()` and what would happen if you left it out?**

2.1 What is `express.json()`? 
*answer:* 
ในไฟล์ index.js เราใส่มันไว้บรรทัดแรกสุดก่อน middleware และ routes ทุกตัว:
app.use(express.json());  // ← บรรทัดนี้
app.use((req, res, next) => {  // request logger
  ...
});

express.json() คือ middleware ที่คอย "แปล" ข้อมูลที่ client ส่งมาใน request body
เวลา client ส่ง POST มา ข้อมูลที่ส่งมาจะเป็น JSON string ดิบๆ เช่น '{"name":"Guitar","price":4500}' ซึ่ง JavaScript อ่านตรงๆ ไม่ได้ 

2.2 what would happen if you left it out?

*answer:* express.json() จะแปลงมันให้เป็น JS object ก่อน แล้วใส่ไว้ใน req.body
ถ้าเอาบรรทัดนี้ออก req.body จะเป็น undefined ทุกครั้ง ทำให้ POST /products ไม่สามารถดึง name, price, quantity ออกมาได้เลย และจะ validate ผิดพลาดเพราะหาข้อมูลไม่เจอ req.body จะเป็น undefined เสมอ ทำให้ destructure name และ price ออกมาไม่ได้ validation จะ fail ทุกครั้ง แม้ client จะส่งข้อมูลมาครบก็ตาม server จะ return 400 ตลอด ทั้งๆ ที่ข้อมูลถูกต้อง

---

**3. What is the difference between `req.body`, `req.params`, and `req.query`? Give a real example from your API for each one.**

*answer:*
req.body — ข้อมูลที่ซ่อนอยู่ใน body ของ request ใช้กับ POST และ PATCH
ตัวอย่าง: ตอน POST /products ส่ง { name: "Guitar", price: 4500 } มา เราดึงออกด้วย req.body.name และ req.body.price

req.params — ส่วนของ URL ที่เราตั้งชื่อไว้ด้วย : เช่น /products/:id
ตัวอย่าง: ตอน GET /products/2 เข้ามา req.params.id จะมีค่าเป็น "2" เราเอาไปหาสินค้าใน array

req.query — ส่วน query string ต่อท้าย URL หลัง ?
ตัวอย่าง: ตอน GET /products?sort=price เข้ามา req.query.sort จะมีค่าเป็น "price" เราเอาไป sort array ก่อน response

---

**4. What are HTTP status codes? List every status code you used in your API and explain why you chose it for that situation.**

*answer:*
HTTP Status Codes คืออะไร?
คือตัวเลข 3 หลักที่ server ส่งกลับมาพร้อมทุก response เพื่อบอก client ว่า "request ที่ส่งมานั้นเป็นยังไง"
 
 Status Code ที่ใช้ในโค้ด
 
 200 — OK ทำงานสำเร็จปกติ เช่น res.status(200).json(result); GET /products — ดึงสินค้าทั้งหมด
 
 201 — Created มีของใหม่เกิดขึ้นในระบบ เช่น
 products.push(newProduct);
 res.status(201).json(newProduct); //POST /products — สร้างสินค้าใหม่สำเร็จ
 ต่างจาก 200 ตรงที่ — 200 แปลว่า "โอเค" แต่ 201 แปลว่า "โอเค และมีของใหม่ถูกสร้างขึ้น" เป็นการบอก client ชัดขึ้นว่าเกิดอะไรขึ้น

 400 — Bad Request ข้อมูลที่ client ส่งมามันผิดหรือไม่ครบ เช่น
 if (!name || price === undefined) {
  const err = new Error("name and price are required");
  err.status = 400;
  return next(err);
} //POST /products — ไม่ส่ง name หรือ price มา
ความผิดอยู่ที่ client ไม่ใช่ server — server ทำงานปกติ แต่ข้อมูลที่ส่งมาใช้ไม่ได้

404 — Not Found หาของที่ขอไม่เจอ เช่น
const product = products.find((p) => p.id === req.params.id);
if (!product) {
  const err = new Error("Product not found");
  err.status = 404;
  return next(err);
} // GET /products/:id — หา id ไม่เจอใน array

500 — Internal Server Error server พังเอง ไม่ใช่ความผิดของ client เช่น
app.use((err, req, res, next) => {
  const status = err.status || 500;  // ← ถ้าไม่มี status ให้ default เป็น 500
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});
เราไม่ได้ตั้งใจ throw 500 ตรงๆ แต่ใช้เป็น safety net — ถ้ามี error ที่ไม่คาดคิดเกิดขึ้น และเราลืมกำหนด err.status ไว้ จะได้ไม่ crash เงียบๆ

---

**5. What is middleware? Describe what it does in your own words and give one example from your code.**

*answer:*
Middleware คือฟังก์ชันที่นั่งอยู่ระหว่าง request กับ response — ทุก request ที่เข้ามาต้องผ่านมันก่อนถึงจะไปถึง route จริงๆ
นึกภาพว่า request เหมือนคนที่จะเข้าคอนเสิร์ต ก่อนเข้าต้องผ่านด่านตรวจบัตรก่อน (middleware) แล้วค่อยเข้าไปชมได้ (route handler)
เช่น
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

ทุก request ที่เข้ามาจะถูก log วันเวลา + method + URL ก่อนเสมอ แล้วเรียก next() เพื่อส่งต่อไปให้ route จัดการต่อ ถ้าไม่เรียก next() request จะค้างอยู่ตรงนี้และ client จะไม่ได้รับ response เลย

---

**6. Why does the order of middleware matter in Express? What could go wrong if it were in the wrong order?**

*answer:*
Express อ่านและรัน middleware จากบนลงล่างตามลำดับที่เราเขียน เหมือนสายพานการผลิต — ต้องทำขั้นตอนที่ 1 ก่อนถึงจะทำขั้นตอนที่ 2 ได้

ลำดับที่ถูกต้องในโค้ดนี้:
express.json() — แปลง body ก่อน
Request Logger — log ทุก request
Routes ทั้งหมด — จัดการ business logic
Error Handler — รับ error จาก routes มาจัดการสุดท้าย

ถ้าเอา express.json() ไว้หลัง routes เวลา POST /products เข้ามา route จะรันก่อน แต่ตอนนั้น req.body ยังไม่ถูกแปลงเลย ก็จะได้ undefined ทุกครั้ง
ถ้าเอา error handler ไว้ต้น ก่อน routes มันจะดัก error ก่อนที่ routes จะมีโอกาสทำงานเลย

---

**7. Walk through what happens on the server, step by step, when a POST request is sent to `/products`.**

*answer:*
สมมติ client ส่ง POST /products มาพร้อม body { "name": "Keyboard", "price": 1999, "quantity": 2 }

1. Request เข้า server — Express รับ request มาที่ port 3000
2. express.json() ทำงาน — แปลง JSON string ใน body ให้เป็น JS object แล้วใส่ไว้ใน   req.body
3. Request Logger ทำงาน — log ว่า POST /products เข้ามา แล้วเรียก next()
4. Express จับคู่ route — เห็นว่าเป็น POST ที่ /products ก็วิ่งไปที่ app.post("/products", ...)
5. Validate ข้อมูล — เช็คว่ามี name และ price มั้ย ถ้าไม่มีสร้าง error แล้วเรียก next(err) ข้ามไป error handler เลย
6. สร้าง product ใหม่ — สร้าง object ใหม่พร้อม id: String(Date.now()) และ quantity default เป็น 1 ถ้าไม่ได้ส่งมา
7. push เข้า array — products.push(newProduct) เพิ่มเข้า in-memory array
8. ส่ง response กลับ — res.status(201).json(newProduct) ส่งสินค้าที่สร้างใหม่กลับไปพร้อม status 201

---

**8. What is CRUD? Map each operation to the HTTP method and route you used in your API.**

*answer:*
CRUD คือ 4 operation พื้นฐานที่แทบทุก API ต้องมี ย่อมาจาก Create, Read, Update, Delete

CRUD           HTTPMethod          Route            ทำอะไร 
Create         POST              /products         สร้างสินค้าใหม่ push เข้า array
Read           GET               /products         ดึงสินค้าทั้งหมด รองรับ filter/sort 
Read           GET               /products/:id     ดึงสินค้าชิ้นเดียวด้วย idUpdatePATCH/products/:id แก้ไขสินค้าที่มีอยู่แล้ว 
Delete         DELETE            /products/:id     ลบสินค้าออกจาก array

**Read มีสอง route เพราะบางทีอยากดูทั้งหมด บางทีอยากดูแค่ชิ้นเดียว — ต่างความต้องการกัน

---

**9. How does your API respond when something goes wrong — for example, when a product with a given ID does not exist?**

*answer:*
เวลา GET /products/999 เข้ามาแล้วหา id "999" ไม่เจอใน array โค้ดจะสร้าง error object ขึ้นมา ใส่ message ว่า "Product not found" และกำหนด status = 404 แล้วเรียก next(err) แทนที่จะ return response เอง 
  if (!product) {
    const err = new Error("Product not found"); // ← สร้าง error พร้อม message
    err.status = 404;                           // ← แปะ status ไว้ที่ error
    return next(err);                           // ← โยนไปให้ error handler
  }

---

**10. What was the hardest part of building this API and what did you do to get past it?**

*answer:*
ส่วนที่งงที่สุดคือ error handling middleware — ตอนแรกไม่เข้าใจว่าทำไมต้องมี 4 parameters (err, req, res, next) ทั้งๆ ที่ middleware ปกติมีแค่ 3 ตัว (req, res, next)
พอลองเขียนแค่ 3 ตัว Express ไม่ถือว่ามันเป็น error handler เลย ทำให้ error ที่เรียก next(err) ไม่โดนดักเลย
วิธีที่ทำให้เข้าใจได้คือนึกว่ามันเป็น "signature" พิเศษ — Express แยกแยะ error handler ออกจาก middleware ธรรมดาด้วยการนับ parameter ถ้ามี 4 ตัวถึงจะรู้ว่านี่คือ error handler จริงๆ พอเข้าใจจุดนี้แล้วทุกอย่างก็ชัดขึ้นมากเลย


