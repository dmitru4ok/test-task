## THE BUG
# The bug, that occurs sometimes involves exchange rates to be similar for all the currecies happens due to the bug of external API. Sometimes, when request to that API is sent to return exchange rates for certain base, API returns results for the other currency base:
<img width="1369" alt="image" src="https://github.com/dmitru4ok/test-task/assets/99320958/7cb8a759-6a99-4cce-b2ed-f97b65c61ab9">
<img width="1284" alt="image" src="https://github.com/dmitru4ok/test-task/assets/99320958/fe494dab-b2a2-4618-9f0a-5f54b3bc541a">
<img width="1347" alt="image" src="https://github.com/dmitru4ok/test-task/assets/99320958/9a52274e-9675-4b6c-8365-28e88331916a">
<img width="1417" alt="image" src="https://github.com/dmitru4ok/test-task/assets/99320958/bcde2f0a-eedb-4e8a-a3e4-c1e8beebb63c">
As you can see, the content of response is not changed, however, it should have. 






