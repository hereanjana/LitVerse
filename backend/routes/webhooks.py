from fastapi import APIRouter, Request, HTTPException, Depends
from svix.webhooks import Webhook, WebhookVerificationError
import os
from typing import Dict, Any
from core.config import settings
from database import get_db
from crud.user import user_crud
from schemas.user import UserCreate
from sqlalchemy.orm import Session
import logging
from datetime import datetime
import json
import httpx

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,  # Changed to DEBUG for more detailed logs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('webhook_events.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

router = APIRouter()

def log_webhook_event(event_type: str, event_data: Dict[str, Any], status: str, error: str = None):
    """
    Log webhook event details
    """
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "status": status,
        "data": event_data
    }
    
    if error:
        log_entry["error"] = error
    
    logger.info(json.dumps(log_entry, indent=2))

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
    try:
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

        # Process the event
        event_type = event_data.get("type")
        event_object = event_data.get("data", {})
        
        logger.info(f"Processing event type: {event_type}")

        if event_type == "user.created":
            try:
                # Handle new user creation
                user_id = event_object.get("id")
                email_addresses = event_object.get("email_addresses", [])
                first_name = event_object.get("first_name", "")  # Default to empty string
                last_name = event_object.get("last_name", "")    # Default to empty string
                profile_image_url = event_object.get("profile_image_url")
                username = event_object.get("username")

                # Get the primary email address
                primary_email = next(
                    (email["email_address"] for email in email_addresses 
                     if email["id"] == event_object.get("primary_email_address_id")),
                    None
                )

                if not primary_email:
                    error_msg = "No primary email address found"
                    log_webhook_event(event_type, event_object, "error", error_msg)
                    raise HTTPException(status_code=400, detail=error_msg)

                # Convert profile_image_url to string if it's an HttpUrl
                if profile_image_url:
                    profile_image_url = str(profile_image_url)

                # Create user in database with proper handling of null values
                user_in = UserCreate(
                    clerk_id=user_id,
                    email=primary_email,
                    first_name=first_name if first_name else None,
                    last_name=last_name if last_name else None,
                    profile_image_url=profile_image_url,
                    username=username
                )

                # Check if user already exists
                existing_user = user_crud.get_by_clerk_id(db, clerk_id=user_id)
                if existing_user:
                    error_msg = f"User already exists: {user_id}"
                    log_webhook_event(event_type, event_object, "error", error_msg)
                    raise HTTPException(status_code=400, detail="User already exists")

                # Create the user
                user_crud.create(db, obj_in=user_in)
                log_webhook_event(event_type, {
                    "user_id": user_id,
                    "email": primary_email,
                    "username": username
                }, "success")
                
            except Exception as e:
                log_webhook_event(event_type, event_object, "error", str(e))
                raise

        elif event_type == "user.updated":
            try:
                # Handle user updates
                user_id = event_object.get("id")
                email_addresses = event_object.get("email_addresses", [])
                first_name = event_object.get("first_name")
                last_name = event_object.get("last_name")
                profile_image_url = event_object.get("profile_image_url")
                username = event_object.get("username")

                # Log update attempt
                logger.info(f"Attempting to update user: {user_id}")

                # Get the primary email address
                primary_email = next(
                    (email["email_address"] for email in email_addresses 
                     if email["id"] == event_object.get("primary_email_address_id")),
                    None
                )

                if not primary_email:
                    error_msg = "No primary email address found"
                    log_webhook_event(event_type, event_object, "error", error_msg)
                    raise HTTPException(status_code=400, detail=error_msg)

                # Convert profile_image_url to string if it's an HttpUrl
                if profile_image_url:
                    profile_image_url = str(profile_image_url)

                # Fetch the existing user
                existing_user = user_crud.get_by_clerk_id(db, clerk_id=user_id)
                if not existing_user:
                    error_msg = f"User not found: {user_id}"
                    log_webhook_event(event_type, event_object, "error", error_msg)
                    raise HTTPException(status_code=404, detail="User not found")

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
                log_webhook_event(event_type, {
                    "user_id": user_id,
                    "updated_fields": update_data
                }, "success")

            except Exception as e:
                log_webhook_event(event_type, event_object, "error", str(e))
                raise

        elif event_type == "user.deleted":
            try:
                # Handle user deletion (deactivate instead of delete)
                user_id = event_object.get("id")
                
                # Fetch the existing user
                existing_user = user_crud.get_by_clerk_id(db, clerk_id=user_id)
                if not existing_user:
                    error_msg = f"User not found: {user_id}"
                    log_webhook_event(event_type, event_object, "error", error_msg)
                    raise HTTPException(status_code=404, detail="User not found")

                # Deactivate the user
                update_data = {"is_active": False}
                user_crud.update(db, db_obj=existing_user, obj_in=update_data)
                log_webhook_event(event_type, {
                    "user_id": user_id,
                    "action": "deactivated"
                }, "success")

            except Exception as e:
                log_webhook_event(event_type, event_object, "error", str(e))
                raise

        else:
            # Log unhandled event type
            logger.warning(f"Unhandled event type: {event_type}")
            log_webhook_event(event_type, event_object, "skipped", "Unhandled event type")

        return {"status": "success", "event_type": event_type}

    except Exception as e:
        # Log any unhandled exceptions
        logger.error(f"Unhandled exception in webhook handler: {str(e)}", exc_info=True)
        raise