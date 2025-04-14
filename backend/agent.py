from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import BaseTool
from langchain_core.tools.base import ArgsSchema
from pydantic import BaseModel, Field
from typing import Optional
import requests
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

def get_database():

    client = MongoClient(os.getenv('MONGODB_URL'))

    return client[os.getenv('DB')]


llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash', api_key=os.getenv('GEMINI_API_KEY'))

class Product(BaseModel):
    product_name: str = Field(description="product name")

class ProductTool(BaseTool):
    name: str = "product_tool"
    description: str = "A tool to fetch product details such as product price, quantity, reviews, stars and feature given product name."
    args_schema: Optional[ArgsSchema] = Product

    def _run(self, product_name: str):
        """Use the tool to hit product endpoint and fetch product details given the product name"""
        db = get_database()
        collection = db[os.getenv('COLLECTION')]
        product_details = collection.find({"product_name": product_name})
        details = product_details[0]
        return details

getproduct_tool = ProductTool()

class Place(BaseModel):
    place: str = Field(description="place")

class WeatherTool(BaseTool):
    name: str = "weather_tool"
    description: str = "A tool to fetch current weather details given a place."
    args_schema: Optional[ArgsSchema] = Place

    def _run(self, place: str):
        """Use the tool to hit weather endpoint and fetch current weather details given a place"""
        api_key = os.getenv('WEATHERBIT_API_KEY')
        url = f"https://api.weatherbit.io/v2.0/current?city={place}&key={api_key}"
        response = requests.get(url)
        return response.json()
    
getweather_tool = WeatherTool()
    
tools = []

def invoke_agent(user_input):
    agent = create_react_agent(
        llm,
        tools,
        state_modifier=(
            "You are a personal assistant, that uses available tools to either fetch current weather information of a given place or fetch product details for a given product name."
            "You MUST only respond precisely in 100 words."
        )
    )
    response = agent.invoke({"messages": [("human", user_input)]})
    return response["messages"][-1].content
