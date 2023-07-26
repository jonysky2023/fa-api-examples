import requests
import pprint

# Define las variables para customer-id y Authorization
customer_id = '<customer id>'
bearer_token = '<Bearer Token>'

url = "https://west-eu.api.flexxanalyzer.com/api/v4/user-experiences?perPage=10&page=1"

payload = {}
headers = {
    'Accept': 'application/json',
    'customer-id': customer_id,
    'Authorization': f'Bearer {bearer_token}'
}

response = requests.request("GET", url, headers=headers, data=payload)

pprint.pp(response.text)
