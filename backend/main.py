from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging

# Import API routes
from app.api.user import router as user_router
from app.api.ai import router as ai_router
from app.api.form import router as form_router

# ✅ Initialize FastAPI app with a title
app = FastAPI(title="ThinkForward API", debug=True)

# ✅ Enable logging for debugging
logging.basicConfig(level=logging.DEBUG)

# ✅ CORS Middleware (Required if frontend & backend run on different domains)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include API routes
app.include_router(user_router, prefix="/user", tags=["User"])
app.include_router(ai_router, prefix="/ai", tags=["AI"])
app.include_router(form_router, prefix="/form", tags=["Form"])

# ✅ Root health check endpoint
@app.get("/", tags=["Health Check"])
def root():
    return {"message": "ThinkForward API is running 🚀"}

# ✅ Handle unhandled exceptions for better debugging
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logging.error(f"Unhandled error: {exc}")
    return {"error": "An unexpected error occurred. Please try again."}
