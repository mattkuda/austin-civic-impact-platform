

we had 2 ideas: 
1. sustainability challenge generator bot
2. volunteering marketplace for local communities

via one good 🏓 match we decided how we can combine them - ACID 💊 😜

Austin
Civic
Impact
Driver


1. community members submit requests 1.playground swing is broken 2.fence is tilted, 3.racoons unfed
2. from these requests LLM generates events: 1.fix playground + fence 2.feed racoons
3. volunteers complete these events and earn points in local leaderboard
4. Apartment complex office managers can pick top monthly leaders and give them discounts or some other percs

LLAMA part
- we cluster requests by Latitude, Longtitude
- we calculated cosine similarity for pairs of requests inside cluster
- We then feed them into LLAMA to output events generated from these requests

