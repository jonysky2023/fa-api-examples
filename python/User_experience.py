import requests
import pprint

url = "https://west-eu.api.flexxanalyzer.com/api/v4/user-experiences?perPage=10&page=1"

payload={}
headers = {
  'Accept': 'application/json',
  'customer-id': '103670da-f3b8-4d51-95dd-49596b9ddf1a',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcnMiOlsiMTAzNjcwZGEtZjNiOC00ZDUxLTk1ZGQtNDk1OTZiOWRkZjFhIl0sIm5hbWUiOiJhZ2VudCIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNjkwMTkwMDY3LCJleHAiOjE2OTAzNjI4Njd9._ZY5IqK78TsGoHqiq5HMUH3uKX_Aemin9A4s_kcxWz0'
}

response = requests.request("GET", url, headers=headers, data=payload)

pprint.pp(response.text)