from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from agent import invoke_agent, tools, getweather_tool, getproduct_tool
import os

load_dotenv()

tool_registry = {
    "getweather_tool": getweather_tool,
    "getproduct_tool": getproduct_tool,
    # Add more tools here as needed
}

app = FastAPI()

origins = [
    f"{os.getenv('FRONTEND_URL')}"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def default():
    return {"response":"on"}


class UserInput(BaseModel):
    user_query: str

class ToolInput(BaseModel):
    tool_name: str

@app.post("/connect_tool")
async def connect_tool(tool: ToolInput):
    # Implement logic to connect the tool to the agent
    tool_instance = tool_registry.get(tool.tool_name)
    if tool_instance is None:
        return {"message": f"Unknown tool: {tool.tool_name}"}
    if tool_instance in tools:
        return {"message": f"{tool.tool_name} is already connected"}
    tools.append(tool_instance)
    return {"message": f"{tool.tool_name} connected to Agent"}

@app.post("/ask")
def invoke_llm(user_input: UserInput):
    # llm call
    response = invoke_agent(user_input.user_query)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app=app, host="0.0.0.0", port=8000)