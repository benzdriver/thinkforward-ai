from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def form_test():
    return {"message": "Form API is working"}
