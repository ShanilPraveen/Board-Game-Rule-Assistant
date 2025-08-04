import google.generativeai as genai
import os 

def call_gemini(prompt:str)->str:
    """
    Call the Gemini API to generate a response based on the provided prompt.
    
    Args:
        prompt (str): The input prompt for the Gemini model.
        
    Returns:
        str: The generated response from the Gemini model.
    """
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    geminimodel = genai.GenerativeModel(model_name="models/gemini-1.5-flash-latest")
    response = geminimodel.generate_content(prompt)
    return response.text.strip()
    
