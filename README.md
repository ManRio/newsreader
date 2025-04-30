# 📰 News Reader - Proyecto Full Stack con IA

Una aplicación web full stack para leer noticias personalizadas, con autenticación, perfil de usuario, subida de avatar, intereses y más. Construido con **React (Next.js)** en el frontend y **Node.js + MongoDB** en el backend.

---

## 📁 Estructura del Proyecto

```
/news-reader-project
├── backend/     # Servidor Express + MongoDB
└── frontend/    # Cliente Next.js 15
```

---

## 🚀 Tecnologías

- **Frontend**: React + Next.js 15, TailwindCSS, Lucide, JWT
- **Backend**: Node.js, Express, MongoDB, Mongoose, Multer
- **Autenticación**: JWT
- **IA**: Integración opcional futura para recomendaciones inteligentes

---

## 🔧 Requisitos

- Node.js ≥ 18
- MongoDB Atlas (o local)
- Cuenta en GitHub

---

## 🛠️ Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/ManRio/newsreader
cd news-reader-project
```

---

### 2. Configura variables de entorno

#### 🗂️ `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/news-reader
JWT_SECRET=loquequieras
```

#### 🗂️ `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### 3. Instala dependencias

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

### 4. Ejecuta en desarrollo

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

---

## ☁️ Despliegue Gratuito

### 🔹 Backend (Render)

1. Sube el proyecto a GitHub.
2. Crea cuenta en [https://render.com](https://render.com)
3. Elige **New → Web Service** y conecta tu repo.
4. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js` o el que uses
   - **Environment**: configura tus variables (`MONGODB_URI`, `JWT_SECRET`)
5. Render asignará una URL tipo: `https://news-reader-api.onrender.com`

---

### 🔹 Frontend (Vercel)

1. Crea cuenta en [https://vercel.com](https://vercel.com)
2. Importa el repo desde GitHub
3. En settings:
   - **Framework**: Next.js
   - **Environment Variable**:
     - `NEXT_PUBLIC_API_URL=https://news-reader-api.onrender.com`
4. Despliega y accede vía `https://tu-proyecto.vercel.app`

---

## ✨ Features

- [x] Registro e inicio de sesión
- [x] Gestión de perfil (usuario, email, avatar)
- [x] Intereses personalizados
- [x] Feed inteligente (próximamente con IA)
- [x] Responsive design
- [x] Dark mode + efecto glass
- [x] Despliegue gratuito compatible

---

## 🧠 A futuro

- 🔍 Buscador de noticias con IA
- 🔔 Notificaciones y recordatorios
- 📱 PWA para usar como app móvil
- 📊 Dashboard de lectura

---

## 🧑‍💻 Autor

Desarrollado por [ManRio](https://github.com/ManRio)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. ¡Úsalo, modifícalo y compártelo!
