from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def ai_test():
    return {"message": "AI API is working"}
