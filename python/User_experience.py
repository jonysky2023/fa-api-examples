import requests
import pprint

# Define las variables para customer-id, Authorization, perPage y page
customer_id = '<customer id>'
bearer_token = '<Bearer Token>'
per_page = 10
page = 1

url = f"https://west-eu.api.flexxanalyzer.com/api/v4/user-experiences?perPage={per_page}&page={page}"

payload = {}
headers = {
    'Accept': 'application/json',
    'customer-id': customer_id,
    'Authorization': f'Bearer {bearer_token}'
}

response = requests.request("GET", url, headers=headers, data=payload)

pprint.pp(response.text)
