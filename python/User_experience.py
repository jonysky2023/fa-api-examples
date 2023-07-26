import requests
import pprint

url = "https://west-eu.api.flexxanalyzer.com/api/v4/user-experiences?perPage=10&page=1"

payload={}
headers = {
  'Accept': 'application/json',
  'customer-id': '',
  'Authorization': ''
}

response = requests.request("GET", url, headers=headers, data=payload)

pprint.pp(response.text)
