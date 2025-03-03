from pydantic import BaseModel, Field
from typing import List, Optional

class LanguageTestScores(BaseModel):
    ielts: Optional[float] = Field(None, description="Score for IELTS")
    celpip: Optional[float] = Field(None, description="Score for CELPIP")

class WorkExperience(BaseModel):
    job_title: str = Field(..., description="Title of the job")
    company_name: str = Field(..., description="Name of the company")
    start_date: str = Field(..., description="Start date of the job")
    end_date: Optional[str] = Field(None, description="End date of the job, None if current")

class EducationDetails(BaseModel):
    institution_name: str = Field(..., description="Name of the educational institution")
    degree_obtained: str = Field(..., description="Name of the degree obtained")
    field_of_study: str = Field(..., description="Field of study")
    graduation_year: Optional[int] = Field(None, description="Year of graduation")

class FamilyTies(BaseModel):
    relatives_in_canada: bool = Field(False, description="Whether the user has family in Canada")
    number_of_relatives: Optional[int] = Field(None, description="Number of relatives in Canada, if any")

class UserProfileDetails(BaseModel):
    language_scores: LanguageTestScores = Field(..., description="Language proficiency scores")
    work_experiences: List[WorkExperience] = Field([], description="List of work experiences")
    education_history: List[EducationDetails] = Field([], description="List of educational qualifications")
    family_in_canada: FamilyTies = Field(..., description="Family ties in Canada")

class UserProfileSchema(BaseModel):
    clerk_user_id: str = Field(..., description="The Clerk user ID associated with this profile")
    basic_ground: UserProfileDetails = Field(..., description="Detailed structured user data")

    class Config:
        schema_extra = {
            "example": {
                "clerk_user_id": "clerk1234",
                "basic_ground": {
                    "language_scores": {
                        "ielts": 7.5,
                        "celpip": 5.0
                    },
                    "work_experiences": [
                        {
                            "job_title": "Software Developer",
                            "company_name": "Tech Innovations Inc.",
                            "start_date": "2019-04-01",
                            "end_date": None
                        }
                    ],
                    "education_history": [
                        {
                            "institution_name": "University of Technology",
                            "degree_obtained": "Bachelor of Science in Computer Science",
                            "field_of_study": "Computer Science",
                            "graduation_year": 2018
                        }
                    ],
                    "family_in_canada": {
                        "relatives_in_canada": True,
                        "number_of_relatives": 3
                    }
                }
            }
        }
