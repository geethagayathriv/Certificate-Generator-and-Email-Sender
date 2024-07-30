from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
import requests

app=FastAPI()

UPLOAD_DIR="uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def get_access_token(client_id, client_secret, refresh_token):
    auth_url= "https://account.uipath.com/oauth/token"
    auth_payload = {
        "grant_type": "refresh_token",
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token
    }
    response = requests.post(auth_url, data = auth_payload)
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        raise Exception("Failed to get access token")
    
def trigger_uipath_job(access_token, release_key, excel_path, docx_path):
    account_logical_name = ""
    tenant_name = ""
    url = ""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "startInfo": {
            "ReleaseKey": release_key,
            "Strategy": "Specific",
            "RobotIds": [],
            "JobCount": 0,
            "Source": "Manual",
            "InputArguments": f'{{"excelPath": "{excel_path}", "docxPath":"{docx_path}"}}'
        }
    }
    response = requests.post(url, json = payload, headers = headers)
    response.raise_for_status()
    return response.json()

@app.post("/api/upload")
async def upload_files(
    excel_file: UploadFile = File(...), docx_file: UploadFile = File(...)
):
    try:
        excel_path = os.path.join(UPLOAD_DIR, excel_file.filename)
        docx_path = os.path.join(UPLOAD_DIR, docx_file.filename)

        with open(excel_path, "wb") as f:
            shutil.copyfileobj(excel_file.file, f)

        with open(docx_path, "wb") as f:
            shutil.copyfileobj(docx_file.file, f)
      
        client_id = ""
        client_secret = ""
        refresh_token = ""
        access_token = get_access_token(client_id, client_secret, refresh_token)

        release_key = ""
        response = trigger_uipath_job(access_token, release_key, excel_path, docx_path)
        

        return JSONResponse(content={"message": "Files uploaded successfully. Workflow triggered"})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/")
def read_root():
    return {"Hello":"World"}