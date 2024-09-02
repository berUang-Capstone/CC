
# berUang Cloud Computing Path

BerUang dirancang untuk mengatasi tantangan finansial yang dihadapi oleh generasi muda, termasuk perilaku belanja impulsif dan kurangnya keterampilan dalam membuat anggaran. Tujuan kami adalah meningkatkan literasi keuangan melalui aplikasi pelacak pengeluaran yang intuitif, disesuaikan dengan kebiasaan digital Gen Z. Dengan integrasi kecerdasan buatan, BerUang memberikan rekomendasi pribadi untuk menabung dan mengatur pengeluaran. Aplikasi ini juga dilengkapi teknologi OCR untuk melacak pengeluaran secara mudah dengan memindai foto struk. Kami berencana untuk menambahkan fitur rekomendasi makanan berdasarkan preferensi pengguna dan anggaran dalam pembaruan mendatang.

Cloud Computing dan Backend: API endpoint kami di-deploy menggunakan Google Cloud Run untuk memastikan skalabilitas dan keandalan. Backend dibangun dengan menggunakan Express.js dan Flask, memberikan kerangka server-side yang kokoh dan efisien. Kami menerapkan MQTT untuk komunikasi antara aplikasi dan backend, sehingga memungkinkan pertukaran data secara real-time. Selain itu, sebuah dashboard telah dibuat untuk memantau ketersediaan layanan, mencatat aktivitas, serta memastikan operasi platform BerUang berjalan dengan lancar.

## OUR TEAM
Team ID : C241-PS377 


(ML) M007D4KY1851 – Hendra Sutrisno – Universitas Dian Nuswantoro 

(ML) M007D4KY2576 – Rizky Syah Gumelar – Universitas Dian Nuswantoro 

(ML) M200D4KY1483 – Safril Isnaini – Universitas Diponegoro 

(CC) C010D4KY0299 – Muhammad Alif Ismady – Universitas Indonesia 

(CC) C007D4KY0863 – Rayhan Satria Andromeda – Universitas Dian Nuswantoro 

(MD) A005D4KY4238 – Muhammad Damara Fathur Rahman – Universitas Bina Nusantara 

(MD) A005D4KX4246 – Nasywa Tsuraya – Universitas Bina Nusantara 

## How To Run Code
Before All:

touch "key.json" di root directory project. Minta value di discord ke alif
ganti value di store/firebase.js buat config firebase. Minta value di discord juga
Cara Run

```bash
npm run deploy
```
```bash
Run "npm run dev"
```

Run "npm run dev
Important
Jangan commit key.json ato firebase.js kalo udah diisi valuenya, nanti git add nya per file aja
## 🔗 Links

10-MIN VIDEO PRESENTATION LINK:
(https://youtu.be/KDhNTU4KmYs)






## berUang Google Cloud Architecture Design

![Untitled (2)](https://github.com/berUang-Capstone/CC/assets/92311039/d5b395dd-4c91-437b-8b6a-211befb5a51e)


Pada Gambar 3.1, terlihat ilustrasi desain arsitektur Google Cloud yang menggunakan beberapa layanan serverless untuk tahap pengembangan. Pengguna mengakses aplikasi melalui perangkat mereka, seperti smartphone atau komputer. Autentikasi pengguna dilakukan menggunakan Firebase Authentication, yang memastikan bahwa hanya pengguna terverifikasi yang dapat mengakses aplikasi.
API REST dikembangkan menggunakan Node.js dan Express.js, dan berfungsi sebagai penghubung antara pengguna dan layanan backend. API ini dideploy menggunakan Cloud Run, yang memungkinkan API untuk dijalankan secara serverless. Penyimpanan cloud menggunakan Cloud Storage digunakan untuk menyimpan berbagai data yang dibutuhkan oleh aplikasi, seperti file gambar, video, atau dokumen lainnya.Untuk penyimpanan data aplikasi secara efisien, digunakan Cloud Firestore, sebuah basis data NoSQL yang memungkinkan query real-time dan menawarkan skalabilitas serta fleksibilitas dalam penyimpanan data. 
Model klasifikasi kategori dikembangkan menggunakan framework Flask dan dijalankan dalam container Docker. Model ini kemudian dideploy menggunakan Cloud Run, yang memungkinkan model berjalan secara serverless dan skalabel.Selain itu, model OCR (Optical Character Recognition) juga dikembangkan menggunakan framework Flask dan dijalankan dalam container Docker. Model ini juga dideploy menggunakan Cloud Run, yang memungkinkan pengenalan teks dari gambar atau dokumen secara otomatis. Desain arsitektur ini memanfaatkan kekuatan Google Cloud dalam menyediakan layanan serverless yang efisien dan skalabel. 



## berUang ERD
![Untitled Diagram drawio (2)](https://github.com/berUang-Capstone/CC/assets/92311039/2e2e3d48-406a-43e7-8e06-963b7439317f)
## berUang Flow Diagram
![Flow drawio](https://github.com/berUang-Capstone/CC/assets/92311039/4f4c4321-e2b3-43c2-a8a2-39b8afc52a82)

## berUang Cloud Pricing 
![Screenshot 2024-07-11 095952](https://github.com/berUang-Capstone/CC/assets/92311039/6235d1e4-ec3e-412b-9c4c-67487d5d52fc)
![Screenshot 2024-07-11 102758](https://github.com/berUang-Capstone/CC/assets/92311039/8b93894b-6a19-4898-9585-444211deef55)
![Screenshot 2024-07-11 103634](https://github.com/berUang-Capstone/CC/assets/92311039/e65efb54-5f74-48ea-be7e-a9f331722a04)
