from fastapi import APIRouter, Request, HTTPException, Depends
from svix.webhooks import Webhook, WebhookVerificationError
import os
from typing import Dict, Any
from core.config import settings
from database import get_db
from crud.user import user_crud
from schemas.user import UserCreate
from sqlalchemy.orm import Session

router = APIRouter()

async def fetch_user_data(user_id: str):
    """Fetch user data from Clerk"""
    clerk_secret_key = os.getenv("CLERK_SECRET_KEY")
    if not clerk_secret_key:
        raise HTTPException(
            status_code=500,
            detail="CLERK_SECRET_KEY not configured"
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.clerk.com/v1/users/{user_id}",
            headers={
                "Authorization": f"Bearer {clerk_secret_key}",
                "Content-Type": "application/json"
            }
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch user data"
            )

        return response.json()

@router.post("/webhooks")
async def handle_webhook(request: Request, db: Session = Depends(get_db)):
    # Use settings instead of os.getenv
    SIGNING_SECRET = settings.CLERK_WEBHOOK_SECRET
    
    if not SIGNING_SECRET:
        raise HTTPException(
            status_code=500,
            detail="CLERK_WEBHOOK_SECRET not configured"
        )

    # Get headers and raw body
    headers = request.headers
    payload = await request.body()
    
    # Verify webhook signature
    wh = Webhook(SIGNING_SECRET)
    try:
        # wh.verify() already returns a dictionary
        event_data: Dict[str, Any] = wh.verify(
            payload,
            {
                "svix-id": headers.get("svix-id"),
                "svix-timestamp": headers.get("svix-timestamp"),
                "svix-signature": headers.get("svix-signature"),
            }
        )
        
    except WebhookVerificationError as err:
        raise HTTPException(
            status_code=400,
            detail=f"Webhook verification failed: {str(err)}"
        )

    # Process the event based on its type
    event_type = event_data.get("type")
    event_object = event_data.get("data", {})
    
    if event_type == "user.created":
        # Handle new user creation
        user_id = event_object.get("id")
        email_addresses = event_object.get("email_addresses", [])
        first_name = event_object.get("first_name")
        last_name = event_object.get("last_name")
        profile_image_url = event_object.get("profile_image_url")
        username = event_object.get("username")

        # Get the primary email address
        primary_email = next(
            (email["email_address"] for email in email_addresses 
             if email["id"] == event_object.get("primary_email_address_id")),
            None
        )

        if not primary_email:
            raise HTTPException(
                status_code=400,
                detail="No primary email address found"
            )

        # Convert profile_image_url to string if it's an HttpUrl
        if profile_image_url:
            profile_image_url = str(profile_image_url)

        # Create user in database
        user_in = UserCreate(
            clerk_id=user_id,
            email=primary_email,
            first_name=first_name,
            last_name=last_name,
            profile_image_url=profile_image_url,
            username=username
        )

        # Check if user already exists
        existing_user = user_crud.get_by_clerk_id(db, clerk_id=user_id)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User already exists"
            )

        # Create the user
        user_crud.create(db, obj_in=user_in)
        print(f"User created in database: {user_id}")
        
    elif event_type == "user.updated":
        # Handle user updates
        user_id = event_object.get("id")
        email_addresses = event_object.get("email_addresses", [])
        first_name = event_object.get("first_name")
        last_name = event_object.get("last_name")
        profile_image_url = event_object.get("profile_image_url")
        username = event_object.get("username")

        # Get the primary email address
        primary_email = next(
            (email["email_address"] for email in email_addresses 
             if email["id"] == event_object.get("primary_email_address_id")),
            None
        )

        if not primary_email:
            raise HTTPException(
                status_code=400,
                detail="No primary email address found"
            )

        # Convert profile_image_url to string if it's an HttpUrl
        if profile_image_url:
            profile_image_url = str(profile_image_url)

        # Fetch the existing user
        existing_user = user_crud.get_by_clerk_id(db, clerk_id=user_id)
        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Update user fields
        update_data = {
            "email": primary_email,
            "first_name": first_name,
            "last_name": last_name,
            "profile_image_url": profile_image_url,
            "username": username
        }

        # Update the user in the database
        user_crud.update(db, db_obj=existing_user, obj_in=update_data)
        print(f"User updated in database: {user_id}")
        
    elif event_type == "user.deleted":
        # Handle user deletion (deactivate instead of delete)
        user_id = event_object.get("id")
        
        # Fetch the existing user
        existing_user = user_crud.get_by_clerk_id(db, clerk_id=user_id)
        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Deactivate the user
        update_data = {"is_active": False}
        user_crud.update(db, db_obj=existing_user, obj_in=update_data)
        print(f"User deactivated in database: {user_id}")

    return {"status": "success", "event_type": event_type}