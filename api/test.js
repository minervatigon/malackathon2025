// Este es el contenido del archivo /api/test.js

export default function handler(request, response) {
    response.status(200).json({
        message: "¡Hola desde el backend de Vercel! 👋"
    });
}