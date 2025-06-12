import os
import json
from openai import OpenAI
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_comparison_with_ai(era: str, points: float, rebounds: float , assists: float) -> Dict[str, Any]:
    system_prompt = '''You are an expert NBA analyst.
    Your task is to generate NBA player comparisons.
    The comparison should be appropriate for the specified stats and era.
    
    For 1980s: Pick 1 player who primarily played in the decade of 1980 to 1989.
    For 1990s: Pick 1 player who primarily played in the decade of 1990 to 1999.
    For 2000s: Pick 1 player who primarily played in the decade of 2000 to 2009.
    For 2010s: Pick 1 player who primarily played in the decade of 2010 to 2019.
    For 2020s: Pick 1 player who primarily played in the period of 2020 to the present day.
    For All-Time: Think Big. Pick 1 player who played in any era across all of NBA history.
    
    Return the comparison in the following JSON structure:
    {
        'player_name': 'The player's name',
        'explanation': 'Detailed explanation of why the comparison is accurate'
    }
    '''
    
    try:
        response = client.chat.completions.create(
            model='gpt-3.5-turbo-0125',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': f'Generate a {era} era comparison based on the stats: Points {points}, Rebounds: {rebounds}, Assists {assists}'}
            ],
            response_format={'type': 'json_object'},
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        if content is None:
            raise ValueError("No content returned from OpenAI API.")
        comparison_data = json.loads(content)
        
        required_fields =['player_name', 'explanation']
        for field in required_fields:
            if field not in comparison_data:
                raise ValueError(f'Missing required field: {field}')
            
        return comparison_data
            
    except Exception as e:
        print(e)
        return {
            'player_name': 'James Harden',
            'explanation': 'You are an absolute baller.'
        }